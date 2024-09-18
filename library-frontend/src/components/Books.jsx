import { useState } from "react";

const GenreSet = ({ setGenre }) => {
  return (
    <div>
      <button
        value={"refactoring"}
        onClick={({ target }) => setGenre(target.value)}
      >
        refactoring
      </button>
      <button value={"agile"} onClick={({ target }) => setGenre(target.value)}>
        agile
      </button>
      <button
        value={"patterns"}
        onClick={({ target }) => setGenre(target.value)}
      >
        patterns
      </button>
      <button value={"design"} onClick={({ target }) => setGenre(target.value)}>
        design
      </button>
      <button value={"crime"} onClick={({ target }) => setGenre(target.value)}>
        crime
      </button>
      <button
        value={"classig"}
        onClick={({ target }) => setGenre(target.value)}
      >
        classic
      </button>
      <button
        value={"all genres"}
        onClick={({ target }) => setGenre(target.value)}
      >
        all genres
      </button>
    </div>
  );
};

const Books = ({ books }) => {
  let [genre, setGenre] = useState("all genres");
  if (genre !== "all genres") {
    books = books.filter((book) => book.genres == genre);
  } else {
    books = books;
  }
  return (
    <div>
      <h2>books</h2>
      in genre <strong>{genre !== null ? genre : null}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <GenreSet setGenre={setGenre} />
      </div>
    </div>
  );
};

export default Books;
