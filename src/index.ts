import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as _ from 'lodash';
import caller from 'grpc-caller';
import { GraphQLSchema } from 'graphql';

import { GrpcGraphqlSchemaConfiguration } from './types';
import { getGraphqlTypeFromProtoDefinition } from './type_converter';
import {
  getGraphqlQueriesFromProtoService,
  getGraphQlSubscriptionsFromProtoService,
} from './service_converter';

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
  TypeDefinitionCache,
} from './types';

export function getGraphqlSchemaFromGrpc({
  endpoint,
  protoFile,
  serviceName,
  packageName,
}: GrpcGraphqlSchemaConfiguration): Promise<GraphQLSchema> {
  const client = caller(
    endpoint,
    path.resolve(__dirname, protoFile),
    serviceName,
    null,
    {
      'grpc.max_send_message_length': -1,
      'grpc.max_receive_message_length': -1,
    },
  );
  const getProtobufDefPromise = protobuf
    .load(protoFile)
    .then(root => root.toJSON())
    .then((obj) => {
      const packagePaths = packageName.split('.');
      for (let i = 0; i < packagePaths.length; i += 2) {
        packagePaths.splice(i, 0, 'nested');
      }
      return _.get(obj, packagePaths.join('.'));
    });

  return getProtobufDefPromise.then(({ nested }) => {
    const types = Object.keys(nested)
      .filter(key => 'fields' in nested[key])
      .reduce((acc, key) => {
        const definition = nested[key];

        // skip empty
        if (key.startsWith('Empty')) {
          return acc;
        }

        return acc.concat([
          getGraphqlTypeFromProtoDefinition({
            definition,
            typeName: key,
          }),
        ]);
      }, []);

    const query = Object.keys(nested)
      .filter(key => 'methods' in nested[key] && key === serviceName)
      .reduce((__, key) => {
        const definition = nested[key];

        return getGraphqlQueriesFromProtoService({
          definition,
          serviceName: key,
          client,
        });
      }, null);

    const subscription = Object.keys(nested)
      .filter(key => 'methods' in nested[key] && key === serviceName)
      .reduce((__, key) => {
        const definition = nested[key];

        return getGraphQlSubscriptionsFromProtoService({
          definition,
          serviceName: key,
          client,
        });
      }, null);

    return new GraphQLSchema({
      query,
      types,
      subscription,
    });
  });
}