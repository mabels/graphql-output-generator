import {
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLString,
  GraphQLObjectTypeConfig,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
  GraphQLList,
  GraphQLInputFieldConfig,
  GraphQLInputObjectTypeConfig
} from 'graphql';
import { ObjectMap } from '../types';
import {
  TypeWrapperGraphQLType,
  Resolve,
  typeWrapper,
  ResolveReturn
} from './types';

const IDFIELD = {
  id: {
    description: 'here id of a location',
    type: new GraphQLNonNull(GraphQLString)
  }
};

const COUNTRY = {
  country: {
    description: 'The country the data should be pulled from.',
    type: new GraphQLNonNull(GraphQLString)
  }
};

const LANGUAGE = {
  language: {
    description: 'The preferred language of the data.',
    type: new GraphQLNonNull(GraphQLString)
  }
};

function wrapOptionals(o: ObjectMap): GraphQLInputFieldConfigMap {
  return {
    ...o,
    ...LANGUAGE,
    ...COUNTRY,
    optionals: {
      description: 'be faster',
      type: new GraphQLList(GraphQLString)
    }
  };
}

function toOutput(f: {
  [k: string]: GraphQLFieldConfig<any, any>;
}): GraphQLFieldConfigMap<any, any> {
  return f;
}

interface FactoryOptions {
  testOption<T extends GraphQLType>(
    direction: string,
    objectTypeFactory: (o: ObjectMap) => T
  ): TypeWrapperGraphQLType<T>;
}

function testOutputType<T extends GraphQLType>(
  direction: string,
  objectTypeFactory: (o: ObjectMap) => T
): TypeWrapperGraphQLType<T> {
  return typeWrapper(new GraphQLList(
    objectTypeFactory({
      name: `TestOutput${direction}`,
      fields: {
        direction: { type: GraphQLString }
      }
    })
  ) as T); /* why is the compiler so stupid */
}

const OutputFactoryOptions: FactoryOptions = {
  testOption: testOutputType
};

function testInputType<T extends GraphQLType>(
  direction: string,
  objectTypeFactory: (o: ObjectMap) => T
): TypeWrapperGraphQLType<T> {
  return typeWrapper(
    objectTypeFactory({
      name: `TestInput${direction}`,
      fields: {
        list: { type: new GraphQLList(GraphQLString) },
        sync: { type: GraphQLBoolean }
      }
    })
  );
}

const InputFactoryOptions = {
  testOption: testInputType
};

function factory<T extends GraphQLType>(
  direction: string,
  objectTypeFactory: (o: ObjectMap) => T,
  factoryOption: FactoryOptions,
  mixIn: { [id: string]: any } = {}
): ObjectMap {
  return {
    ...mixIn,
    metadata: {
      type: objectTypeFactory({
        name: `metadata${direction}`,
        fields: {
          deleted: { type: GraphQLBoolean },
          createdAt: { type: GraphQLFloat },
          updatedAt: { type: GraphQLFloat }
        }
      })
    },
    id: { type: GraphQLString },
    customTitle: { type: GraphQLString }
  };
}

export const HereLocationOutputFieldConfigMap = toOutput(
  factory(
    'Output',
    (o: GraphQLObjectTypeConfig<any, any>) => new GraphQLObjectType(o),
    OutputFactoryOptions,
    IDFIELD
  )
);

export const HereLocationOutputType = new GraphQLObjectType({
  description: 'Here Location Type Output',
  name: 'HereLocationOutput',
  fields: HereLocationOutputFieldConfigMap
});

export interface GetHereLocationInput {
  readonly id: string;
}

export interface GetHereLocationInputArgs {
  input: GetHereLocationInput;
}

export interface UpdateHereLocationInput {
  location: GetHereLocationInput;
}
export interface UpdateHereLocationInputArgs {
  input: UpdateHereLocationInput;
}

export interface HereLocationUpstreamResponse {
  id: string;
}

function toInput(f: {
  [k: string]: GraphQLInputFieldConfig;
}): GraphQLInputFieldConfigMap {
  return f;
}

export const HereLocationInputFieldConfigMap = toInput(
  factory(
    'Input',
    (o: GraphQLInputObjectTypeConfig) => new GraphQLInputObjectType(o),
    InputFactoryOptions,
    IDFIELD
  )
);

export const HereLocationInputType = new GraphQLInputObjectType({
  description: 'Here Location Type Input',
  name: 'HereLocationInput',
  fields: HereLocationInputFieldConfigMap
});

export function hereUpdateLocation(
  resolve: Resolve<
    UpdateHereLocationInputArgs,
    HereLocationUpstreamResponse,
    {}
  >
): ResolveReturn<UpdateHereLocationInputArgs, {}> {
  return {
    resolve,
    type: HereLocationOutputType,
    args: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'UpdateHereLocationInput',
          fields: wrapOptionals({
            location: { type: HereLocationInputType }
          })
        })
      }
    },
    description: 'Retrieve here Locations'
  };
}

export function hereGetLocation(
  resolve: Resolve<GetHereLocationInputArgs, HereLocationUpstreamResponse, {}>
): ResolveReturn<GetHereLocationInputArgs, {}> {
  return {
    resolve,
    type: HereLocationOutputType,
    args: {
      input: {
        type: new GraphQLInputObjectType({
          name: 'GetHereLocationInput',
          fields: wrapOptionals({
            ...IDFIELD
          })
        })
      }
    },
    description: 'Retrieve a Location'
  };
}
