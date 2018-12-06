import { injectOutput } from '../inject-output';

export const queryGetLocation = injectOutput<{}, {}>(
  (fetcher, input, output) => {
    const q = `TEST(${output})`;
    return fetcher(q, { input });
  }
);

export const queryUpdateLocation = injectOutput((fetcher, input, output) => {
  const q = `TEST(${output})`;
  return fetcher(q, { input });
});
