import { omit } from 'lodash';
import { AxiosInstance, AxiosResponse } from 'axios';

interface AxiosMockedInstance extends AxiosInstance {
  _setupMock: (params: [MockParams]) => void;
  _clean: () => void;
}

type HTTPMethod = 'post' | 'delete' | 'put' | 'get' | 'options';

interface MockParams extends AxiosResponse {
  method: HTTPMethod;
  url: string;
}

interface MockStructure {
  delete: { [key: string]: AxiosResponse };
  get: { [key: string]: AxiosResponse };
  post: { [key: string]: AxiosResponse };
  put: { [key: string]: AxiosResponse };
  options: { [key: string]: AxiosResponse };
}

const FROZEN_DATA: MockStructure = {
  delete: {},
  get: {},
  post: {},
  put: {},
  options: {}
};

const DEFAULT_RESPONSE = {
  status: 200
};

let _cached = FROZEN_DATA;

const clean = () => {
  _cached = Object.create(FROZEN_DATA);
};

const setupMock = (params: [MockParams]) => {
  params.forEach(param => {
    _cached[param.method][param.url] = omit<AxiosResponse, MockParams>(param, ['method', 'url']);
  });
};

const generateMethod = (method: HTTPMethod) => (
  (url: string): Promise<AxiosResponse> => Promise.resolve(_cached[method][url] || DEFAULT_RESPONSE)
);

const axios: AxiosMockedInstance = jest.genMockFromModule('axios');
axios._setupMock = setupMock;
axios._clean = clean;
axios.post = generateMethod('post');
axios.get = generateMethod('get');
axios.delete = generateMethod('delete');
axios.put = generateMethod('put');

export = axios;
