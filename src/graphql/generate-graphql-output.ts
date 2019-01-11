import * as path from 'path';
import { indent, indents } from '../indent';
import { DeclareGraphqlOutputItem, Invocation } from '../types';
import { quoteJsString } from '../quote-js-string';
// import { generateOutputFromSchema } from './graphql-output-from-type';
// import { createSchema } from './create-schema';
// import { QueryCollector } from './query-collector';

function fieldInvocation(d: DeclareGraphqlOutputItem): Invocation {
  return d.queryField || d.mutationField;
}

function schema(style: 'queries' | 'mutations', fields: string[]): string[] {
  if (!fields.length) {
    return [];
  }
  const ret: string[] = [];
  ret.push(indent(0, `${style}: {`));
  fields.forEach(field => {
    ret.push(indent(2, `${field}: ${field}({}),`));
  });
  ret.push(indent(0, '},'));
  return ret;
}

export function generateGraphqlOutput(
  items: DeclareGraphqlOutputItem[],
  fname = 'generatedGraphql'
): string {
  let out: string[] = [];
  out.push(`(function ${fname}() {`);
  out.push(
    indent(
      2,
      `var createSchema = require(${quoteJsString(
        path.join(__dirname, './create-schema')
      )}).createSchema;`
    )
  );
  out.push(
    indent(
      2,
      `var QueryCollector = require(${quoteJsString(
        path.join(__dirname, '../query-collector')
      )}).QueryCollector;`
    )
  );
  out.push(
    indent(
      2,
      `var graphqlOutputFromType = require(${quoteJsString(
        path.join(__dirname, './graphql-output-from-type')
      )}).graphqlOutputFromType;`
    )
  );
  out = out.concat(
    indents(
      2,
      items.map(
        item =>
          `var ${fieldInvocation(item).varName} = require(${quoteJsString(
            fieldInvocation(item).path
          )}).${fieldInvocation(item).varName};`
      )
    )
  );
  out = out.concat(
    indents(
      2,
      items.map(
        item =>
          `var ${item.query.varName} = require(${quoteJsString(
            item.query.path
          )}).${item.query.varName};`
      )
    )
  );
  out.push(indent(2, 'var queryCollector = new QueryCollector();'));
  out.push(indent(2, 'var schema = createSchema({'));
  out = out.concat(
    indents(
      4,
      schema(
        'queries',
        items
          .filter(item => item.queryField)
          .map(item => item.queryField.varName)
      )
    )
  );
  out = out.concat(
    indents(
      4,
      schema(
        'mutations',
        items
          .filter(item => item.mutationField)
          .map(item => item.mutationField.varName)
      )
    )
  );
  out.push(indent(2, '});'));
  // out = out.concat(
  items.forEach(item => {
    out.push(indent(2, '{'));
    out = out.concat(
      indents(3, [
        `var ${item.output.varName} = require(${quoteJsString(
          item.output.path
        )}).${item.output.varName};`,

        // `${item.queryMethod}.inject(queryCollector.collect(${JSON.stringify(JSON.stringify(item))}), {}, generateOutputFromSchema(schema, ${item.outputType}));`,
        `queryCollector.collect(JSON.parse(${JSON.stringify(
          JSON.stringify(item)
        )}), graphqlOutputFromType(schema, ${item.output.varName}));`
      ])
    );
    out.push(indent(2, '}'));
  });
  // out.push('console.log(queryCollector);');
  out.push(indent(2, 'return queryCollector;'));
  out.push('})');
  return out.join('\n');
}
