module.exports = [`
type Github {
  _id: ID!
  githubId: ID!
  name: String,
  scopes: String
}

type User {
  _id: ID!
  avatar: String
  isAdmin: Boolean
  email: String!
  github: Github
}

type Token {
  token: String!
  iat: String!
  exp: String!
  user: User!
}
`];
