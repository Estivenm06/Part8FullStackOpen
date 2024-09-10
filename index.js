import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v1 } from "uuid";
const uuid = v1;

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky",
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz",
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Books!]!
    allAuthors: [Authors!]!
  }
  type Books {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type Authors {
    name: String!
    born: Int
    id: String!
    bookCount: Int!
  }
  type Mutation{
    addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    ): Books
    editAuthor(author: String!, sendBornTo: Int!): Authors
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books;
      } else if (args.author && !args.genre) {
        const filterAuthor = books.filter(
          (book) => book.author === args.author
        );
        return filterAuthor;
      } else if (!args.author && args.genre) {
        const filterGenre = books.filter((book) =>
          book.genres.includes(args.genre)
        );
        return filterGenre;
      } else {
        const filterAuthor = books.filter(
          (book) => book.author === args.author
        );
        if (filterAuthor) {
          const filterGenre = filterAuthor.filter((book) =>
            book.genres.includes(args.genre)
          );
          return filterGenre;
        } else {
          return books;
        }
      }
    },
    allAuthors: () => authors,
  },
  Authors: {
    bookCount: (root) => {
      const author = books.map((element) => element.author);
      const map = author.reduce(
        (accumulator, book) => (
          (accumulator[book] = accumulator[book] + 1 || 1), accumulator
        ),
        {}
      );
      const value = author.find((element) => element === root.name);
      return map[value];
    },
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() };
      //console.log(authors.find((author) => author.name === args.author));
      if (authors.find((author) => author.name === args.author)) {
        books = books.concat(book);
        return book;
      } else {
        const author = { name: args.author, id: uuid() };
        //console.log(author);
        authors = authors.concat(author);
        books = books.concat(book);
        return book;
      }
    },
    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.author);
      if (!author) {
        return null;
      }
      const authorToUpdate = { ...author, born: args.sendBornTo };
      authors = authors.map((author) =>
        author.name === args.author ? authorToUpdate : author
      );
      //console.log(authors);
      return authorToUpdate;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
