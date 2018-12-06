export declare type ObjectMap = { [id: string]: any };

export interface Fetcher<T> {
  (query: string, params: any): Promise<T>;
}

export interface Invocation {
  readonly path: string;
  readonly varName: string;
}

export interface DeclareGraphqlOutputItem {
  readonly queryField?: Invocation;
  readonly mutationField?: Invocation;

  readonly query: Invocation;

  readonly output: Invocation;
}

export interface GenerateGraphqlOutputItem extends DeclareGraphqlOutputItem {
  readonly outputQuery: string;
}
