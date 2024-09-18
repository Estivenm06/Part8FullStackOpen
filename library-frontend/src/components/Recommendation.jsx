import { useQuery } from "@apollo/client";
import { GETUSER } from "../queries";

export const Recommedantion = ({ books }) => {
  const { data, error, loading } = useQuery(GETUSER);

  if (loading) return <div>loading...</div>;
  books = books.filter((element) => element.genres == data.me.favoriteGenre);
  return (
    <>
      <h1>recommendations</h1>
      <p>
        books in your favorite genre <strong>{data.me.favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book, id) => (
            <tr key={id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
