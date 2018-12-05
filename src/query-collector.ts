import { GenerateGraphqlOutputItem } from './generate-graphql-output';

export class QueryCollector {
  public readonly queries: GenerateGraphqlOutputItem[] = [];

  public collect<T>(jsonGenerateGraphqlOutputItem: string): (q: string, p: any) => Promise<T> {
    return (q: string, p: any): Promise<T> => {
      this.queries.push({
        ...JSON.parse(jsonGenerateGraphqlOutputItem),
        gqQuery: q,
      });
      return Promise.resolve({} as T);
    };
  }

  writeInjectJavascript(): string {
    const ret: string[] = [];
    this.queries.forEach((item) => {
      ret.push(`const { ${item.queryMethod} } = require('${item.gqPath}');`);
      ret.push(`${item.queryMethod}(() => Promise.resolve({}), {}, () => ${JSON.stringify(item.gqQuery)});`);
    });
    return ret.join('\n');
  }
}
