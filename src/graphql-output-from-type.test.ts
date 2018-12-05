import { createSchema, dummyQuery, dummyOutputType } from './create-schema';
import { graphqlOutputFromType } from './graphql-output-from-type';

test('generate output', () => {
  const schema = createSchema({
    queries: dummyQuery
  });
  const ret = graphqlOutputFromType(schema, dummyOutputType);
  expect(ret.split(/\s*[\n\r]\s*/)).toEqual([
    'dummy',
    'nested {',
    'nestedString',
    '}'
  ]);
});
