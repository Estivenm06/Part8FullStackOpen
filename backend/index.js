import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import { v1 } from "uuid";
const uuid = v1;

import Author from "./src/models/authorSchema.js";
import Book from "./src/models/bookSchema.js";
import User from "./src/models/userSchema.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(URI)
  .then((response) => console.log("Connected mongodb at ", URI))
  .catch((error) => console.log("Error connecting mongodb ", error));

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
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    }
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }
  type Author {
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
    ): Book!
    editAuthor(author: String!, sendBornTo: Int!): Author
    createUser(username: String! favoriteGenre: String!): User
    login(username: String! password: String!): Token
  }
  type User{
  username: String!
  favoriteGenre: String!
  id: ID!
  }
  type Token{
  value: String!
  }

`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        console.log(await Book.find());
        return await Book.find();
      } else if (args.author && !args.genre) {
        return await Book.find({ author: args.author });
      } else if (!args.author && args.genre) {
        return await Book.find({ genres: [args.genre] });
      } else {
        return await Book.find({ author: args.author, genres: [args.genre] });
      }
    },
    allAuthors: () => authors,
    me: (root, args, { currentUser }) => currentUser,
  },
  Author: {
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
    addBook: async (root, args, { currentUser }) => {
      const book = new Book({ ...args });
      const person = await Author.find({ author: args.author });
      if (!currentUser) {
        throw new GraphQLError("invalid token", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        if (person) {
          console.log(person._id);
          console.log(book);
          book.author = person._id;
          await book.save();
        } else {
          const author = new Author({ name: args.author, born: null });
          book.author = author._id;
          await author.save();
        }
      } catch (error) {
        throw new GraphQLError(error.errors.title.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
      return book;
    },
    editAuthor: async (root, args, { contextUser }) => {
      if (!args.author && !contextUser) {
        return null;
      }
      try {
        return await Author.findOneAndUpdate(
          { name: args.author },
          { name: args.author, born: args.sendBornTo }
        );
      } catch (error) {
        throw new GraphQLError("Updating the author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    createUser: (root, args) => {
      const user = new User(args);

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "SECRET") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: args.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
