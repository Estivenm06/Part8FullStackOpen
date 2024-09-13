import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const {
    data: authors,
    loading: loadAu,
    error: errAu,
  } = useQuery(ALL_AUTHORS);
  const { data: books, loading: loadBo, error: errBo } = useQuery(ALL_BOOKS);
  if (loadAu || loadBo) return <div>Loading...</div>;
  const padding = {
    padding: 5,
  };
  return (
    <Router>
      <div>
        <Link style={padding} to={"/authors"}>
          <button>authors</button>
        </Link>
        <Link style={padding} to={"/books"}>
          <button>books</button>
        </Link>
        <Link style={padding} to={"/add"}>
          <button>add book</button>
        </Link>
      </div>

      <Routes>
        <Route
          path="/authors"
          element={<Authors authors={authors.allAuthors} />}
        ></Route>
        <Route path="/books" element={<Books books={books.allBooks} />}></Route>
        <Route path="/add" element={<NewBook />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
