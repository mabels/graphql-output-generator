import { GenerateGraphqlOutputItem } from './generate-graphql-output';

export class QueryCollector {
  public readonly queries: GenerateGraphqlOutputItem[] = [];

  public collect<T>(jsonGenerateGraphqlOutputItem: string, q: string): void {
    this.queries.push({
      ...JSON.parse(jsonGenerateGraphqlOutputItem),
      gqQuery: q
    });
  }

  writeInjectJavascript(): string {
    const ret: string[] = [];
    this.queries.forEach(item => {
      ret.push(`const { ${item.queryMethod} } = require('${item.queryPath}');`);
      ret.push(`${item.queryMethod}.inject(${JSON.stringify(item.gqQuery)});`);
    });
    return ret.join('\n');
  }
}
