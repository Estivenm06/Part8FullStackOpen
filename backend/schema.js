export const typeDefs = `
type Subscription {
    bookAdded: Book!
}
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
  id: ID!
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