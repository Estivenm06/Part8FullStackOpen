import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

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
    ): Book
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
        return await Book.find({}).populate("author");
      } else if (args.author && !args.genre) {
        return await Book.find({ author: args.author }).populate("author");
      } else if (!args.author && args.genre) {
        return await Book.find({ genres: [args.genre] }).populate("author");
      } else {
        return await Book.find({
          author: { name: args.author },
          genres: [args.genre],
        }).populate("author");
      }
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, { currentUser }) => currentUser,
  },
  Author: {
    bookCount: async (root) => {
      const author = await Book.find().populate("author");
      const map = author.reduce(
        (accumulator, book) => (
          (accumulator[book.author.name] =
            accumulator[book.author.name] + 1 || 1),
          accumulator
        ),
        {}
      );
      const value = await Author.find({ name: root.name });
      return map[value[0].name];
    },
  },
  Book: {
    author: (root) => {
      return {
        name: root.author.name,
        born: root.author.born,
        id: root.author._id,
        bookCount: root.author.bookCount,
      };
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      const book = new Book({ ...args });
      const person = await Author.find({ name: args.author });
      if (!currentUser) {
        throw new GraphQLError("invalid token", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        if (person[0]) {
          book.author = person[0]._id;
          await book.save();
        } else {
          const newAuthor = new Author({ name: args.author, born: null });
          await newAuthor.save();
          book.author = newAuthor._id;
          await book.save();
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
