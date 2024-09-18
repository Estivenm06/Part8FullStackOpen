import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query getByGenre($genre: String){
    allBooks(genre: $genre){
      author {
        name
        id
        born
        bookCount
      }
      title
      published
      genres
      id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author
      published
      genres
      id
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($author: String!, $sendBornTo: Int!) {
    editAuthor(author: $author, sendBornTo: $sendBornTo) {
      name
      born
      bookCount
      id
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
    value
    }
  }
`;

export const GETUSER = gql`
  query{
  me{
  id
  username
  favoriteGenre
  }
  }
`