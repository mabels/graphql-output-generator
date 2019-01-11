import {
  GenerateGraphqlOutputItem,
  DeclareGraphqlOutputItem,
  quoteJsString
} from './index';

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
      ret.push('{');
      ret.push(
        `var ${item.query.varName} = require(${quoteJsString(
          item.query.path
        )}).${item.query.varName};`
      );
      ret.push(
        `${item.query.varName}.inject(${JSON.stringify(item.outputQuery)});`
      );
      ret.push('}');
    });
    return ret.join('\n');
  }
}
