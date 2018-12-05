import {
  createMutationSchema,
  createQuerySchema,
  dummyQuery
} from './create-schema';
import { graphql } from 'graphql';
import { stringify } from 'querystring';

test('regression dummy name error', async () => {
  const schema = createQuerySchema(dummyQuery);
  const gq = await graphql({
    schema,
    source: '{ dummyQuery { dummy } }'
  });
  expect(gq).toEqual({
    data: {
      dummyQuery: null
    }
  });
});
