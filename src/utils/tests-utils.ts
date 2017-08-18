import { mongoose, dbConnect } from 'services/mongoose';
import { clearDatabase } from 'commands/clear-database';

export const initTestCase = () => {
  beforeAll(() => dbConnect());
  afterAll(() => mongoose.disconnect());
  afterEach(() => clearDatabase());
};
