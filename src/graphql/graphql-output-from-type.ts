import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { indent } from '../indent';

export interface Prepare {
  readonly type?: GraphQLObjectType;
  readonly name?: string;
}

export interface GenerateOutputType {
  (t: GraphQLObjectType): string;
}

export function graphqlOutputFromType(
  schema: GraphQLSchema,
  t: GraphQLObjectType,
  out: string[] = [],
  level = 0
): string {
  if (t.getFields) {
    Object.entries(t.getFields()).forEach(([_, v]) => {
      const ql = (v as any) as Prepare;
      if (!(ql.name && ql.type)) {
        throw new Error(
          `graphqlOutputFromType can not traverse without name and type`
        );
      }
      // const found = schema.getTypeMap()[clean(ql.type)] as GraphQLObjectType;
      // const o = [];
      // for (const i in ql.type) {
      //   o.push(i, typeof i, (ql.type as any)[i]);
      // }
      let found = ql.type;
      if ((ql.type as any).ofType) {
        found = (ql.type as any).ofType;
      }
      // console.log(ql.type, typeof ql.type, o);
      if (found && found.getFields) {
        // console.log(v, typeof(found), ql.type, found.getFields);
        out.push(indent(level, `${ql.name} {`));
        graphqlOutputFromType(schema, found, out, level + 1);
        out.push(indent(level, `}`));
      } else {
        out.push(indent(level, ql.name));
      }
    });
  } else {
    out.push(t.name);
  }
  return out.join('\n');
}

/*
export function generateOutputFromSchema(
  schema: GraphQLSchema,
  t: GraphQLObjectType
): () => string {
  return () => {
    return graphqlOutputFromType(schema, t);
  };
}
*/
