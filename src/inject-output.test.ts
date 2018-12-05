import { injectOutput } from './inject-output';
import { Fetcher } from './types';

interface TestResult {
  testResult: string;
}

test('inject-output', async () => {
  const testQuery = injectOutput(
    (
      fetcher: Fetcher<TestResult>,
      input: {},
      outputQuery: string
    ): Promise<TestResult> => {
      const q = `${outputQuery}`;
      return fetcher(q, { input });
    }
  );
  const toInject = 'xxx';
  testQuery.inject('xxx');
  expect(await testQuery(async q => ({ testResult: q }), {})).toEqual({
    testResult: toInject
  });
});

test('inject-output not injected', async () => {
  const testQuery = injectOutput(
    (
      fetcher: Fetcher<TestResult>,
      input: {},
      outputQuery: string
    ): Promise<TestResult> => {
      const q = `${outputQuery}`;
      return fetcher(q, { input });
    }
  );
  try {
    await testQuery(async q => ({ testResult: q }), {});
    fail('should never go there');
  } catch (e) {
    expect(e.message).toEqual('output of queryFunction was not injected');
  }
});
