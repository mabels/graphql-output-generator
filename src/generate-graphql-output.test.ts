import { generateGraphqlOutput } from './generate-graphql-output';
import { QueryCollector } from './query-collector';

test('test generate output', () => {
  // execa.shellSync('yarn run compile');
  const toGenerate = [
    {
      queryField: 'hereGetLocation',
      resolverPath: './generate-graphql-output.helper-test',
      queryMethod: 'getLocationQuery',
      gqPath: './generate-graphql-output.helper-test',
    },
    {
      mutationField: 'hereUpdateLocation',
      resolverPath: './generate-graphql-output.helper-test',
      queryMethod: 'updateLocationMutation',
      gqPath: './generate-graphql-output.helper-test',
    },
  ];
  const jsEval = generateGraphqlOutput(toGenerate);
  // tslint:disable-next-line:no-eval
  const generatedGraphql = eval(jsEval);
  const qc: QueryCollector = generatedGraphql();
  expect(qc.queries).toEqual([
    {
      ...toGenerate[0],
      gqQuery: 'TEST',
    },
    {
      ...toGenerate[1],
      gqQuery: 'TEST',
    },
  ]);
});
