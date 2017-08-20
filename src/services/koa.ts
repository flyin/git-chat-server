import { IncomingHttpHeaders } from 'http';
import { get } from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaCors from 'kcors';
import * as koaBody from 'koa-bodyparser';
import * as koaLogger from 'koa-logger';
import { graphiqlKoa, graphqlKoa } from 'graphql-server-koa';
import settings from 'settings';
import schema from 'schema';
import { User } from 'models';

const koa = new Koa();
const router = new KoaRouter();

type JWTPayload = {
  userId: string;
};

const getRequestUser = (headers: IncomingHttpHeaders, query: any) => {
  const token: string = get(headers, 'authorization') || get(query, 'access_token');

  try {
    const payload: JWTPayload = jwt.verify(token, settings.secret) as JWTPayload;
    return User.findOne({ _id: payload.userId });
  } catch (err) {
    return Promise.resolve(null);
  }
};

router.post('/', koaBody(), graphqlKoa(async (ctx: Koa.Context) => ({
  context: {
    currentUser: getRequestUser(ctx.req.headers, ctx.query)
  },

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

export { koa, schema };
