import * as Long from 'long';
import {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLObjectType,
  isListType,
} from 'graphql';

import {
  GRPC_GQL_TYPE_MAPPING,
  TypeDefinitionCache,
} from './types';

function convertToGraphqlType(value: any): any {
  if (Long.isLong(value)) {
    // conver long
    return value.toNumber();
  }

  return value;
}

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
  { definition, typeName },
): GraphQLInputObjectType | GraphQLObjectType {
  const { fields } = definition;

  const fieldsFunction = () => Object.keys(fields).reduce((result, fieldName) => {
    const { rule, type } = fields[fieldName];

    const gqlType = GRPC_GQL_TYPE_MAPPING[type] || TypeDefinitionCache[type];

    // eslint-disable-next-line no-param-reassign
    result[fieldName] = {
      type: rule === 'repeated' ? GraphQLList(gqlType) : gqlType,
    };

    return result;
  }, {});

  const typeDef = {
    name: typeName,
    fields: fieldsFunction,
  };

  // CONVENTION - types that end with `Input` are GraphQL input types
  const type = typeName.endsWith('Input')
    ? new GraphQLInputObjectType(typeDef)
    : new GraphQLObjectType(typeDef);

  TypeDefinitionCache[typeName] = type;
  return type;
}