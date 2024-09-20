import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "../queries";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [p, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook, { data, error, loading }] = useMutation(CREATE_BOOK, {
    refetchQueries: () => [{query: ALL_BOOKS}, {query: ALL_AUTHORS}]
  })
  const submit = async (event) => {
    event.preventDefault();
    const published = Number(p);
    try {
      await createBook({
        variables: { title, author, published, genres },
      });
      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
    } catch (error) {
      console.error("Unexpected error: ", error);
    }
  };

  useEffect(() => {
    try {
      if (data && data.addBook === null) {
        console.log("Error unexpected");
      }
    } catch (error) {}
  }, [data]);

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={p}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </>
  );
};

export default NewBook;
