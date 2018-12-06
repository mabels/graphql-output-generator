import { GenerateGraphqlOutputItem, DeclareGraphqlOutputItem } from './types';

export class QueryCollector {
  public readonly queries: GenerateGraphqlOutputItem[] = [];

  public collect<T>(d: DeclareGraphqlOutputItem, q: string): void {
    this.queries.push({
      ...d,
      outputQuery: q
    });
  }

  writeInjectJavascript(): string {
    const ret: string[] = [];
    this.queries.forEach(item => {
      ret.push(
        `const { ${item.query.varName} } = require('${item.query.path}');`
      );
      ret.push(
        `${item.query.varName}.inject(${JSON.stringify(item.outputQuery)});`
      );
    });
    return ret.join('\n');
  }
}
