const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaCors = require('kcors');
const koaBody = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
const schema = require('../schema');
const settings = require('../settings');

const koa = new Koa();
const router = new KoaRouter();

router.post('/', koaBody(), graphqlKoa(async (ctx) => ({
  // context: { currentUser: getRequestUser({ headers: ctx.req.headers, query: ctx.query }) },
  schema
})));

if (!settings.isProduction) {
  router.get('/graphiql', graphiqlKoa({
    endpointURL: '/',
    subscriptionsEndpoint: `ws://127.0.0.1:${settings.apiPort}/subscriptions`
  }));
}

koa.use(koaLogger());
koa.use(koaCors());
koa.use(router.routes());
koa.use(router.allowedMethods());

module.exports = {koa, schema};
