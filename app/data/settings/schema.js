module.exports = [`
type SettingsGithub {
  _id: String!
  responseType: String!
  redirectUri: String!
  scope: String!
  clientId: String!
  url: String!
}

type Settings {
   _id: ID!
   github: SettingsGithub!
}
`];
