import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as _ from 'lodash';
import grpcCaller from 'grpc-caller';
import {
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLObjectType,
} from 'graphql';

import { GrpcGraphqlSchemaConfiguration } from './types';
import { getGraphqlTypeFromProtoDefinition } from './type_converter';
import {
  getGraphqlQueriesFromProtoService,
  getGraphQlSubscriptionsFromProtoService,
} from './service_converter';
import { getPackageProtoDefinition } from './protobuf';
import { access } from 'fs';

export {
  getGraphqlQueriesFromProtoService,
  getGraphQlSubscriptionsFromProtoService,
} from './service_converter';

export {
  convertGrpcTypeToGraphqlType,
  getGraphqlTypeFromProtoDefinition,
} from './type_converter';
export {
  GRPC_GQL_TYPE_MAPPING,
  GrpcGraphqlSchemaConfiguration,
  typeDefinitionCache,
} from './types';

type GraphqlInputTypes = GraphQLInputObjectType | GraphQLObjectType;

export async function getGraphqlSchemaFromGrpc({
  endpoint,
  protoFile,
  serviceName,
  packageName,
}: GrpcGraphqlSchemaConfiguration): Promise<GraphQLSchema> {
  const client = grpcCaller(
    endpoint,
    path.resolve(__dirname, protoFile),
    serviceName,
    null,
    {
      'grpc.max_send_message_length': -1,
      'grpc.max_receive_message_length': -1,
    },
  );

  const { nested }: protobuf.INamespace =
    await getPackageProtoDefinition(protoFile, packageName);

  const types: GraphqlInputTypes[] = Object.keys(nested)
    .filter((key: string) => 'fields' in nested[key])
    .reduce(
      (acc: GraphqlInputTypes[], key: string) => {
        const definition: protobuf.AnyNestedObject = nested[key];

        // skip empty
        if (key.startsWith('Empty')) {
          return acc;
        }

        if ((<protobuf.IType>definition).fields) {
          return acc.concat([
            getGraphqlTypeFromProtoDefinition({
              definition: (<protobuf.IType>definition),
              typeName: key,
            }),
          ]);
        }

        return acc;
      },
      [],
    );

  const query = Object.keys(nested)
    .filter((key: string) => 'methods' in nested[key] && key === serviceName)
    .reduce(
      (__: any, key: string): GraphQLObjectType | null => {
        const definition = nested[key];

        return getGraphqlQueriesFromProtoService({
          client,
          definition,
          serviceName: key,
        });
      },
      null,
    );

  const subscription = Object.keys(nested)
    .filter(key => 'methods' in nested[key] && key === serviceName)
    .reduce(
      (__: any, key: string): GraphQLObjectType | null => {
        const definition = nested[key];

        return getGraphQlSubscriptionsFromProtoService({
          client,
          definition,
          serviceName: key,
        });
      },
      null,
    );

  return new GraphQLSchema({
    query,
    types,
    subscription,
  });
}
