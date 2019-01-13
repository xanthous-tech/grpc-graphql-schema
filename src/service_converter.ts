import * as _ from 'lodash';

import {
  GraphQLObjectType, GraphQLFieldConfigMap, Thunk, GraphQLFieldConfig, GraphQLOutputType,
} from 'graphql';

import { withAsyncIteratorCancel } from './subscription';

import {
  convertGrpcTypeToGraphqlType,
} from './type_converter';

import {
  typeDefinitionCache,
} from './types';

export function getGraphqlQueriesFromProtoService({
  definition,
  serviceName,
  client,
}) {
  const { methods } = definition;
  const fields: Thunk<GraphQLFieldConfigMap<any, any>> = () => Object.keys(methods).reduce(
    (result: GraphQLFieldConfigMap<any, any>, methodName): GraphQLFieldConfigMap<any, any> => {
      const args = {};
      const {
        requestType: requestArgName,
        responseType,
        responseStream,
      } = methods[methodName];

      if (responseStream) {
        // responseStream should be in subscriptions
        return result;
      }

      if (!requestArgName.startsWith('Empty')) {
        args[requestArgName] = {
          type: typeDefinitionCache[requestArgName],
        };
      }

      const queryField = {
        args,
        type: typeDefinitionCache[responseType],
        resolve: async (__, arg) => {
          const response = await client[methodName](
            arg[requestArgName] || {},
            {},
            {
              deadline:
                  Date.now() + (Number(process.env.REQUEST_TIMEOUT) || 200000),
            },
          );
          // FIXME: there is a bug in the graphQL type conversion
          return response;
          // return convertGrpcTypeToGraphqlType(
          //   response,
          //   typeDefinitionCache[responseType],
          // );
        },
      };

      // eslint-disable-next-line no-param-reassign
      result[`${serviceName}${methodName}`] = <GraphQLFieldConfig<any, any>>queryField;

      return result;
    },
    {
      // adding a default ping
      ping: {
        type: <GraphQLOutputType>typeDefinitionCache.ServerStatus,
        resolve: () => ({ status: 'online' }),
      },
    },
  );

  return new GraphQLObjectType({
    fields,
    name: 'Query',
  });
}

export function getGraphQlSubscriptionsFromProtoService({
  definition,
  serviceName,
  client,
}) {
  const { methods } = definition;
  const fields = () => Object.keys(methods).reduce((result, methodName) => {
    const args = {};
    const {
      requestType: requestArgName,
      responseType,
      responseStream,
    } = methods[methodName];

    if (!responseStream) {
      // non-responseStream should be in queries / mutations
      return result;
    }

    if (!requestArgName.startsWith('Empty')) {
      args[requestArgName] = {
        type: typeDefinitionCache[requestArgName],
      };
    }

    const subscribeField = {
      type: typeDefinitionCache[responseType],
      args,
      subscribe: async (__, arg, { pubsub }) => {
        const response = await client[methodName](
          arg[requestArgName] || {},
          {},
        );

        response.on('data', (data) => {
          const payload = {};
          payload[
            `${serviceName}${methodName}`
          ] = convertGrpcTypeToGraphqlType(data, typeDefinitionCache[responseType]);
          pubsub.publish(`${methodName}-onSubscribe`, payload);
        });

        response.on('error', (error) => {
          // debug(error);
          if (error.code === 1) {
            // cancelled
            // debug('request cancelled');
            response.removeAllListeners('error');
            // debug('error handler removed');
            response.removeAllListeners();
            // debug('all other handlers removed');
          }
        });

        response.on('end', () => {
          // debug('stream ended');
          response.removeAllListeners();
          // debug('all listeners removed');
        });

        const asyncIterator = pubsub.asyncIterator(
          `${methodName}-onSubscribe`,
        );

        return withAsyncIteratorCancel(asyncIterator, () => {
          // debug('on cancel');
          response.cancel();
          // debug('on cancel done');
        });
      },
    };

    // eslint-disable-next-line no-param-reassign
    result[`${serviceName}${methodName}`] = subscribeField;

    return result;
  }, {});

  if (_.isEmpty(fields())) {
    return null;
  }

  return new GraphQLObjectType({
    name: 'Subscription',
    fields,
  });
}