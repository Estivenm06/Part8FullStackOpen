import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, UPDATE_AUTHOR } from "../queries";
import Select from "react-select";

const Authors = ({authors}) => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState("");

  const options = authors.map((author) => {
    return { value: author.name, label: author.name };
  });
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });
  const update = async (event) => {
    event.preventDefault();
    const sendBornTo = Number(born);
    const author = name.value;
    await updateAuthor({ variables: { author, sendBornTo } });

    setName("");
    setBorn("");
  };
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set bithyear</h2>
      <form onSubmit={update}>
        <div>
          <Select defaultValue={name} onChange={setName} options={options} />
        </div>
        <div>
          born{" "}
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
