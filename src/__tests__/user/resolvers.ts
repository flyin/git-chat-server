import { get } from 'lodash';
import { graphql } from 'graphql';

import { initTestCase } from 'utils/tests-utils';
import schema from 'schema';
import userResolvers from 'resolvers/user';
import { mongoose } from 'services/mongoose';
import { UserModel } from 'models/user';

initTestCase();

const { createUser } = userResolvers.Mutation;
const userModel = mongoose.model<UserModel>('User');

describe('user resolvers', () => {
  describe('mutation', () => {
    const userCreateQuery = `
        mutation user($email: String!, $password: String!) {
          createUser(email: $email, password: $password) {
            email
            isAdmin
          }
        }
      `;

    it('user can register with email and password', async () => {
      const user = { email: 'a@b.ru', password: '123' };
      const result = await graphql(schema, userCreateQuery, {}, {}, user);
      expect(result.data).toMatchSnapshot();
      expect(result.errors).toBeUndefined();
    });

    it('user cant register with invalid data', async () => {
      const user = { email: 'a@', password: '123' };
      const result = await graphql(schema, userCreateQuery, {}, {}, user);
      expect(result.data).toBeNull();
      expect(result.errors).toMatchSnapshot();
    });

    it('user can exchange email and password for token', async () => {
      const user = { email: 'aa@aa.ru', password: '123' };
      await createUser(null, user);

      const query = `
        mutation token($email: String!, $password: String!) {
          createTokenByPassword(email: $email, password: $password) {
            token
            iat
            exp
            user {
              email
            }
          }
        }
      `;

      const result = await graphql(schema, query, {}, {}, user);
      const returnData = get(result.data, 'createTokenByPassword', {});

      expect(result.errors).toBeUndefined();
      expect(returnData).toHaveProperty('token');
      expect(returnData).toHaveProperty('user');
      expect(get(returnData, 'user')).toMatchObject({ email: user.email });
    });

    it('user can register with github token');
    it('user can reset their password');
    it('user can connect github to account');
    it('user can disconnect github from account');
  });

  describe('query', () => {
    const query = `
        query user($userId: ID) {
          getUser(userId: $userId) {
            email
            isAdmin
          }
        }
      `;

    it('user can access to own profile', async () => {
      let result;
      const user = await createUser(null, { email: 'aa@aa.ru', password: '123' });
      result = await graphql(schema, query, {}, { currentUser: Promise.resolve(user) });

      expect(result.errors).toBeUndefined();
      expect(get(result.data, 'getUser.email')).toBe(user.email);

      result = await graphql(schema, query, {}, { currentUser: Promise.resolve(user) }, { userId: 'some-exists-or-not-id' });

      expect(result.errors).toBeUndefined();
      expect(get(result.data, 'getUser.email')).toBe(user.email);
    });

    it('admin user can access to any account', async () => {
      let result;
      const user = await createUser(null, { email: 'aa@aa.ru', password: '123' });

      const adminUser = await userModel.create({
        email: 'admin@example.com',
        password: '123',
        isAdmin: true
      });

      result = await graphql(schema, query, {}, { currentUser: Promise.resolve(adminUser) }, { userId: user.id });

      expect(result.errors).toBeUndefined();
      expect(get(result.data, 'getUser.email')).toBe(user.email);

      result = await graphql(schema, query, {}, { currentUser: Promise.resolve(adminUser) }, { userId: adminUser.id });

      expect(result.errors).toBeUndefined();
      expect(get(result.data, 'getUser.email')).toBe(adminUser.email);
    });
  });

  describe('subscriptions', () => {
    it('notify socket then user is registered');
  });
});
