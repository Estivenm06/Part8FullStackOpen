import { gql } from "@apollo/client";

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      genres
      title
      published
      author {
        name
        born
        id
        bookCount
      }
    }
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query getByGenre($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      genres
      title
      id
      published
      author {
        name
        born
        id
        bookCount
      }
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
      id
      title
      author {
        id
        name
        born
        bookCount
      }
      genres
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
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const GETUSER = gql`
  query {
    me {
      favoriteGenre
      id
      username
    }
  }
`;
