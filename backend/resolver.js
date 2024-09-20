import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

import Author from "./src/models/authorSchema.js";
import Book from "./src/models/bookSchema.js";
import User from "./src/models/userSchema.js";

export const resolvers = {
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
      if (!currentUser) {
        throw new GraphQLError("invalid token", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        const person = await Author.find({ name: args.author });
        let authorId;
        if (person && person.length > 0) {
          authorId = person[0]._id;
          await Author.findByIdAndUpdate(person[0]._id, {
            name: person[0].name,
            born: person[0].born ? person[0].born : null,
            bookCount: person[0].bookCount + 1,
          });
        } else {
          const newAuthor = new Author({
            name: args.author,
            born: null,
            bookCount: 1,
          });
          await newAuthor.save();
          authorId = newAuthor._id;
        }
        const newBook = new Book({ ...args, author: authorId });
        await newBook.save();
        const book = await Book.findById(newBook._id).populate("author");
        pubsub.publish("BOOK_ADDED", { bookAdded: book });
        return book;
      } catch (error) {
        throw new GraphQLError(error.errors.title.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};
