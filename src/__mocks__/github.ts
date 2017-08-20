import { set } from 'lodash';

type Entity = 'users' | 'repo';

interface MockParams {
  data: any;
  entity: Entity;
  method: string;
  resolve: boolean;
}

interface MockResponse {
  data: any;
}

interface Handlers {
  [key: string]: {
    [key: string]: () => Promise<MockResponse>
  };
}

let cached: Handlers = {};

class MockedGithub {
  auth: any;

  constructor () {
    const that = this;

    Object.keys(cached).forEach(key => {
      set(that, key, cached[key]);
    });
  }

  static _setupMock (params: [MockParams]) {
    params.forEach(param => {
      set(cached, `${param.entity}.${param.method}`, () => param.resolve
        ? Promise.resolve({ data: param.data })
        : Promise.reject({ data: param.data })
      );
    });
  }

  static _clean () {
    cached = Object.create(null);
  }

  authenticate (auth: any) {
    this.auth = auth;
  }
}

export = MockedGithub;
