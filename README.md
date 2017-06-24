# git-chat-server

### Setup packages
`yarn install`

### Configure environment
Create `.env` file with context like this:

```
NODE_ENV=development
MONGO_URL=mongodb://localhost/git-chat
SECRET=SOME_SECRET
GITHUB_CLIENT_ID=ID
GITHUB_CLIENT_SECRET=SECRET
GITHUB_CALLBACK_URL=FRONTEND_URL

```

### Run application

`yarn run start:dev`

### GraphiQL 
GraphiQL interface located at http://127.0.0.1:8000/graphiql
