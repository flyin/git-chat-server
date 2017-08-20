export default [`
type Github {
  _id: ID!
  avatar: String
  githubId: ID!
  name: String,
  scopes: String
}

type User {
  _id: ID!
  isAdmin: Boolean
  email: String!
  github: Github
}

type Token {
  _id: ID!
  token: String!
  iat: String!
  exp: String!
  user: User!
}
`];
