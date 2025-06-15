import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Recommedantion } from "./components/Recommendation";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { LoginForm } from "./components/LoginForm";
import { useApolloClient, useSubscription, useQuery } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  let [genre, setGenre] = useState(null);
  const [book, setBook] = useState([])
  if (genre == "all genres") genre = null;
  const client = useApolloClient();
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = [...book, data.data.bookAdded]
      setBook(bookAdded)
      client.cache.writeQuery({query: ALL_BOOKS, data: {allBooks: [...client.cache.readQuery({query: ALL_BOOKS}).allBooks, bookAdded]}})
      window.alert(`${data.data.bookAdded.title} by ${data.data.bookAdded.author.name} added`)
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("loginUser");
    if (token) {
      setToken(token);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    client.resetStore();
    localStorage.clear();
  };

  const {
    data: authors,
    loading: loadAu,
    error: errAu,
  } = useQuery(ALL_AUTHORS);
  const {
    data: books,
    loading: loadBo,
    error: errBo,
  } = useQuery(ALL_BOOKS, { variables: { genre: genre }});
  useEffect(() => {
    if(books && books.allBooks){
      setBook(books.allBooks)
    }
  }, [books])
  if (loadBo || loadAu) return <div>Loading...</div>;
  return (
    <Router>
      <div>
        <Link to={"/"}>
          <button>authors</button>
        </Link>
        <Link to={"/books"}>
          <button>books</button>
        </Link>
        {token ? (
          <Link to={"/add"}>
            <button>add book</button>
          </Link>
        ) : (
          <Link to={"/login"}>
            <button>login</button>
          </Link>
        )}
        {token ? (
          <Link to={"/recommend"}>
            <button>recommend</button>
          </Link>
        ) : null}
        {token ? (
          <Link to={"/"}>
            <button onClick={logout}>logout</button>
          </Link>
        ) : null}
      </div>

      <Routes>
        <Route
          path="/"
          element={<Authors authors={authors.allAuthors} />}
        ></Route>
        <Route
          path="/books"
          element={
            <Books setGenre={setGenre} genre={genre} books={book} />
          }
        ></Route>
        <Route path="/add" element={<NewBook setBook={setBook}/>}></Route>
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} />}
        ></Route>
        <Route
          path="/recommend"
          element={<Recommedantion books={books.allBooks} />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
