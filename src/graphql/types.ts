import {
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLType,
  GraphQLResolveInfo,
  GraphQLFieldConfig
} from 'graphql';

export declare type GraphQLObjectAbstractType =
  | GraphQLInputType
  | GraphQLObjectType
  | GraphQLType;

export interface TypeWrapperGraphQLType<T extends GraphQLObjectAbstractType> {
  type: T;
}

export function typeWrapper<T extends GraphQLObjectAbstractType>(
  t: T
): TypeWrapperGraphQLType<T> {
  return {
    type: t
  };
}

export interface Resolve<I, O, C> {
  (source: any, args: I, context: C, info: GraphQLResolveInfo): Promise<O>;
}

export declare type ResolveReturn<T, C> = GraphQLFieldConfig<any, C, T>;
