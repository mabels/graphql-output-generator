import { generateGraphqlOutput } from './generate-graphql-output';
import { QueryCollector } from './query-collector';
import { createSchema, dummyQuery, dummyOutputType } from './create-schema';
import { graphqlOutputFromType } from './graphql-output-from-type';
import { Fetcher } from './types';
import { injectOutput } from './inject-output';
import {
  queryGetLocation,
  queryUpdateLocation
} from './test-queries.helper-test';

interface TestResult {
  testResult: string[];
}

const schema = createSchema({ queries: dummyQuery });
const queryOutput = graphqlOutputFromType(schema, dummyOutputType);

const testQuery = injectOutput(
  (
    fetcher: Fetcher<TestResult>,
    input: {},
    outputQuery: string
  ): Promise<TestResult> => {
    const q = `
  query testQuery($input: testInput!) {
    hereGetLocation(input: $input) {
      ${outputQuery}
    }
  }`;
    return fetcher(q, { input });
  }
);

test('test generate output', async () => {
  // execa.shellSync('yarn run compile');
  const toGenerate = [
    {
      queryField: 'hereGetLocation',
      resolverPath: './generate-graphql-output.helper-test',
      queryMethod: 'queryGetLocation',
      queryPath: './test-queries.helper-test',
      outputType: 'dummyOutputType',
      outputPath: './create-schema',
      gqPath: './generate-graphql-output.helper-test'
    },
    {
      mutationField: 'hereUpdateLocation',
      resolverPath: './generate-graphql-output.helper-test',
      queryMethod: 'queryUpdateLocation',
      queryPath: './test-queries.helper-test',
      outputType: 'dummyOutputType',
      outputPath: './create-schema',
      gqPath: './generate-graphql-output.helper-test'
    }
  ];
  const jsEval = generateGraphqlOutput(toGenerate);

  // console.log(jsEval);
  // tslint:disable-next-line:no-eval
  const generatedGraphql = eval(jsEval);
  const qc: QueryCollector = generatedGraphql();
  // console.log(qc.writeInjectJavascript());
  /* other test */
  /* other test */
  expect(qc.queries).toEqual([
    {
      ...toGenerate[0],
      gqQuery: queryOutput
    },
    {
      ...toGenerate[1],
      gqQuery: queryOutput
    }
  ]);
  try {
    await queryUpdateLocation(async () => ({}), {});
    fail('should never reached');
  } catch (e) {
    expect(e.message).toBe('output of queryFunction was not injected');
  }
  try {
    await queryGetLocation(async () => ({}), {});
    fail('should never reached');
  } catch (e) {
    expect(e.message).toBe('output of queryFunction was not injected');
  }
  // console.log(qc.writeInjectJavascript());
  eval(qc.writeInjectJavascript());
  expect(await queryUpdateLocation(async q => q, {})).toBe(
    `TEST(${queryOutput})`
  );
  expect(await queryGetLocation(async q => q, {})).toBe(`TEST(${queryOutput})`);
});
