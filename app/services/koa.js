const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaCors = require('kcors');
const koaBody = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const schema = require('../schema');
const User = require('../data/user');

const koa = new Koa();
const router = new KoaRouter();

router.post('/', koaBody(), graphqlKoa(async (ctx) => {
  const currentUser = await User.handlers.getUserFromRequest({headers: ctx.req.headers, query: ctx.query});

  return ({
    schema,
    context: { currentUser }
  });
}));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/' }));

koa.use(koaLogger());
koa.use(koaCors());
koa.use(router.routes());
koa.use(router.allowedMethods());

module.exports = koa;
