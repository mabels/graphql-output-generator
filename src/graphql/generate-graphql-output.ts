import * as path from 'path';
import { indent, indents } from '../indent';
import { DeclareGraphqlOutputItem, Invocation } from '../types';
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
    ret.push(indent(2, `${field}: ${field}(async () => ({})),`));
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
      `const { createSchema, } = require('${path.join(
        __dirname,
        './create-schema'
      )}');`
    )
  );
  out.push(
    indent(
      2,
      `const { QueryCollector } = require('${path.join(
        __dirname,
        '../query-collector'
      )}');`
    )
  );
  out.push(
    indent(
      2,
      `const { graphqlOutputFromType } = require('${path.join(
        __dirname,
        './graphql-output-from-type'
      )}');`
    )
  );
  out = out.concat(
    indents(
      2,
      items.map(
        item =>
          `const { ${fieldInvocation(item).varName} } = require('${
            fieldInvocation(item).path
          }');`
      )
    )
  );
  out = out.concat(
    indents(
      2,
      items.map(
        item =>
          `const { ${item.query.varName} } = require('${item.query.path}');`
      )
    )
  );
  out.push(indent(2, 'const queryCollector = new QueryCollector();'));
  out.push(indent(2, 'const schema = createSchema({'));
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
        `const { ${item.output.varName} } = require('${item.output.path}');`,

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
