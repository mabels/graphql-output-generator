import * as path from 'path';
import { indent, indents } from './indent';
// import { generateOutputFromSchema } from './graphql-output-from-type';
// import { createSchema } from './create-schema';
// import { QueryCollector } from './query-collector';

export interface GenerateGraphqlOutputItem {
  readonly queryField?: string;
  readonly resolverPath: string;
  readonly queryMethod: string;
  readonly mutationField?: string;
  readonly gqPath: string;
  gqQuery?: string;
}

function schema(style: 'queries'|'mutations', fields: string[]): string[] {
  if (!fields.length) {
    return [];
  }
  const ret: string[] = [];
  ret.push(indent(0, `${style}: {`));
  fields.forEach((field) => {
    ret.push(indent(2, `${field}: ${field}(async () => ({})),`));
  });
  ret.push(indent(0, '},'));
  return ret;
}

export function generateGraphqlOutput(items: GenerateGraphqlOutputItem[], fname = 'generatedGraphql'): string {
  let out: string[] = [];
  out.push(`(function ${fname}() {`);
  out.push(indent(2, `const { createSchema, } = require('${path.join(__dirname, './create-schema')}');`));
  out.push(indent(2, `const { QueryCollector } = require('${path.join(__dirname, './query-collector')}');`));
  out.push(indent(2, `const { generateOutputFromSchema } = require('${path.join(__dirname, './graphql-output-from-type')}');`));
  out = out.concat(indents(2, items.map(item => `const { ${item.queryField || item.mutationField} } = require('${item.resolverPath}');`)));
  out = out.concat(indents(2, items.map(item => `const { ${item.queryMethod} } = require('${item.gqPath}');`)));
  out.push(indent(2, 'const queryCollector = new QueryCollector();'));
  out.push(indent(2, 'const schema = createSchema({'));
  out = out.concat(indents(2, schema('queries', items.filter(item => item.queryField).map(item => item.queryField!))));
  out = out.concat(indents(2, schema('mutations', items.filter(item => item.mutationField).map(item => item.mutationField!))));
  out.push(indent(2, '});'));
  out = out.concat(items.map((item) => {
    return indent(2, `${item.queryMethod}(queryCollector.collect(${JSON.stringify(JSON.stringify(item))}), {}, generateOutputFromSchema(schema));`);
  }));
  // out.push('console.log(queryCollector);');
  out.push(indent(2, 'return queryCollector;'));
  out.push('})');
  return out.join('\n');
}
