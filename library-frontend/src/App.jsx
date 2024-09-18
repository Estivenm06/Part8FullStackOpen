import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Recommedantion } from "./components/Recommendation";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import { LoginForm } from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null);
  let [genre, setGenre] = useState(null);
  if (genre == "all genres") genre = null;
  const client = useApolloClient();

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
  } = useQuery(ALL_BOOKS, { variables: { genre: genre } });
  if (loadAu || loadBo) return <div>Loading...</div>;
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
            <Books setGenre={setGenre} genre={genre} books={books.allBooks} />
          }
        ></Route>
        <Route path="/add" element={<NewBook />}></Route>
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
