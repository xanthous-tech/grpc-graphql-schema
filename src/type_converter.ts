import * as protobuf from 'protobufjs';
import * as Long from 'long';
import {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLObjectType,
  isListType,
  Thunk,
} from 'graphql';

import {
  GRPC_GQL_TYPE_MAPPING,
  typeDefinitionCache,
} from './types';

interface IFieldWithComment extends protobuf.IField {
  comment?: string | null | undefined;
}

interface ITypeWithComment extends protobuf.IType {
  fields: { [k: string]: IFieldWithComment };
  comment?: string | null | undefined;
}

interface ProtoDefinitionInput {
  definition: ITypeWithComment;
  typeName: string;
}

function convertToGraphqlType(value: any): any {
  if (Long.isLong(value)) {
    // conver long
    return value.toNumber();
  }

  return value;
}

// TODO: this convert method is not complete
export function convertGrpcTypeToGraphqlType(payload, typeDef) {
  const fields = typeDef.getFields();

  Object.keys(fields).forEach((key) => {
    const value = payload[key];
    const field = fields[key];
    const fieldType = field.type;

    if (isListType(fieldType)) {
      // process list
      // eslint-disable-next-line no-param-reassign
      payload[key] = value.map(convertToGraphqlType);
    } else {
      // eslint-disable-next-line no-param-reassign
      payload[key] = convertToGraphqlType(value);
    }
  });

  return payload;
}

export function getGraphqlTypeFromProtoDefinition(
  { definition, typeName }: ProtoDefinitionInput,
): GraphQLInputObjectType | GraphQLObjectType {
  const { fields, comment } = definition;

  // TODO: need to set up for either input type or object type
  const fieldsFunction = () => Object.keys(fields)
    .reduce(
      (result, fieldName) => {
        const { rule, type, comment } = fields[fieldName];

        const gqlType = GRPC_GQL_TYPE_MAPPING[type] || typeDefinitionCache[type];

        // eslint-disable-next-line no-param-reassign
        result[fieldName] = {
          type: rule === 'repeated' ? GraphQLList(gqlType) : gqlType,
          description: comment,
        };

        return result;
      },
      {},
    );

  const typeDef = {
    name: typeName,
    fields: fieldsFunction,
    description: comment,
  };

  // CONVENTION - types that end with `Input` are GraphQL input types
  const type = typeName.endsWith('Input')
    ? new GraphQLInputObjectType(typeDef)
    : new GraphQLObjectType(typeDef);

  typeDefinitionCache[typeName] = type;
  return type;
}
