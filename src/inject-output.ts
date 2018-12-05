import { Fetcher } from './types';

export interface InjectOutput<T, P> {
  (fetcher: Fetcher<T>, input: P): Promise<T>;
  inject(output: string): void;
}

export interface OutputInjectQueryFunction<T, P> {
  (fetcher: Fetcher<T>, input: P, outputQuery: string): Promise<T>;
}

class InjectedString {
  public output: string;
  public inject = (output: string): void => {
    this.output = output;
  };
}

export function injectOutput<T, P>(
  cb: OutputInjectQueryFunction<T, P>
): InjectOutput<T, P> {
  const injectedString = new InjectedString();
  const ret = <InjectOutput<T, P>>function(fetcher: Fetcher<T>, input: P) {
    if (!injectedString.output) {
      return Promise.reject(
        new Error(`output of queryFunction was not injected`)
      );
    }
    return cb(fetcher, input, injectedString.output);
  };
  ret.inject = injectedString.inject;
  return ret;
}
