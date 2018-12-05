import {
  GraphQLFieldConfigMap,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLSchemaConfig,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql';

export interface CreateSchemaParams {
  queries?: GraphQLFieldConfigMap<any, any>;
  mutations?: GraphQLFieldConfigMap<any, any>;
}

/* this complexity is need for the test */
export const dummyOutputType = new GraphQLObjectType({
  name: 'DummyQueryOutput',
  fields: {
    dummy: { type: GraphQLString },
    nested: {
      type: new GraphQLObjectType({
        name: 'nestedDummy',
        fields: {
          nestedString: { type: GraphQLString }
        }
      })
    }
  }
});

export const dummyQuery: GraphQLFieldConfigMap<any, any> = {
  dummyQuery: {
    // resolve: dummyResolver,
    type: dummyOutputType,
    args: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'DummyQueryInput',
          fields: {
            dummy: { type: GraphQLString }
          }
        })
      }
    },
    description: 'Retrieve a Location'
  }
};

export function createSchema(p: CreateSchemaParams): GraphQLSchema {
  const ret: GraphQLSchemaConfig = {
    query: new GraphQLObjectType({
      name: 'Query',
      fields: p.queries || dummyQuery
    })
  };
  if (p.mutations) {
    ret.mutation = new GraphQLObjectType({
      name: 'Mutations',
      fields: p.mutations
    });
  }
  return new GraphQLSchema(ret);
}

export function createQuerySchema(
  queries: GraphQLFieldConfigMap<any, any>
): GraphQLSchema {
  return createSchema({ queries });
}

export function createMutationSchema(
  mutations: GraphQLFieldConfigMap<any, any>
): GraphQLSchema {
  return createSchema({ mutations });
}
