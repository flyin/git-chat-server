const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaCors = require('kcors');
const koaBody = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const schema = require('../graphql/schema');
const User = require('../graphql/user');

const koa = new Koa();
const router = new KoaRouter();

router.post('/', koaBody(), graphqlKoa(async (ctx) => ({
  context: { currentUser: User.handlers.getUserFromRequest({headers: ctx.req.headers, query: ctx.query}) },
  schema
})));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/' }));

koa.use(koaLogger());
koa.use(koaCors());
koa.use(router.routes());
koa.use(router.allowedMethods());

module.exports = koa;
