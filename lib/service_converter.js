"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const graphql_1 = require("graphql");
const subscription_1 = require("./subscription");
const type_converter_1 = require("./type_converter");
const types_1 = require("./types");
function getGraphqlMethodsFromProtoService({ definition, serviceName, client, methodType, }) {
    const { methods } = definition;
    const fields = () => Object.keys(methods).reduce((result, methodName) => {
        const args = {};
        const { requestType: requestArgName, responseType, responseStream, } = methods[methodName];
        if (responseStream) {
            // responseStream should be in subscriptions
            return result;
        }
        // filter for queries
        if (methodType === 'Query' && !methodName.startsWith('Get')) {
            return result;
        }
        // filter for mutations
        if (methodType === 'Mutation' && !methodName.startsWith('Set')) {
            return result;
        }
        if (!requestArgName.startsWith('Empty')) {
            args[requestArgName] = {
                type: types_1.typeDefinitionCache[requestArgName],
            };
        }
        const queryField = {
            args,
            type: types_1.typeDefinitionCache[responseType],
            resolve: (__, arg) => __awaiter(this, void 0, void 0, function* () {
                const response = yield client[methodName](arg[requestArgName] || {}, {}, {
                    deadline: Date.now() + (Number(process.env.REQUEST_TIMEOUT) || 200000),
                });
                // FIXME: there is a bug in the graphQL type conversion
                return response;
                // return convertGrpcTypeToGraphqlType(
                //   response,
                //   typeDefinitionCache[responseType],
                // );
            }),
        };
        // eslint-disable-next-line no-param-reassign
        result[`${serviceName}${methodName}`] = queryField;
        return result;
    }, {
        // adding a default ping
        ping: {
            type: types_1.typeDefinitionCache.ServerStatus,
            resolve: () => ({ status: 'online' }),
        },
    });
    return new graphql_1.GraphQLObjectType({
        fields,
        name: methodType,
    });
}
function getGraphqlQueriesFromProtoService({ definition, serviceName, client, }) {
    return getGraphqlMethodsFromProtoService({
        definition,
        serviceName,
        client,
        methodType: 'Query',
    });
}
exports.getGraphqlQueriesFromProtoService = getGraphqlQueriesFromProtoService;
function getGraphqlMutationsFromProtoService({ definition, serviceName, client, }) {
    return getGraphqlMethodsFromProtoService({
        definition,
        serviceName,
        client,
        methodType: 'Mutation',
    });
}
exports.getGraphqlMutationsFromProtoService = getGraphqlMutationsFromProtoService;
function getGraphQlSubscriptionsFromProtoService({ definition, serviceName, client, }) {
    const { methods } = definition;
    const fields = () => Object.keys(methods).reduce((result, methodName) => {
        const args = {};
        const { requestType: requestArgName, responseType, responseStream, } = methods[methodName];
        if (!responseStream) {
            // non-responseStream should be in queries / mutations
            return result;
        }
        if (!requestArgName.startsWith('Empty')) {
            args[requestArgName] = {
                type: types_1.typeDefinitionCache[requestArgName],
            };
        }
        const subscribeField = {
            args,
            type: types_1.typeDefinitionCache[responseType],
            subscribe: (__, arg, { pubsub }) => __awaiter(this, void 0, void 0, function* () {
                const response = yield client[methodName](arg[requestArgName] || {}, {});
                response.on('data', (data) => {
                    const payload = {};
                    payload[`${serviceName}${methodName}`] = type_converter_1.convertGrpcTypeToGraphqlType(data, types_1.typeDefinitionCache[responseType]);
                    pubsub.publish(`${methodName}-onSubscribe`, payload);
                });
                response.on('error', (error) => {
                    if (error.code === 1) {
                        // cancelled
                        response.removeAllListeners('error');
                        response.removeAllListeners();
                    }
                });
                response.on('end', () => {
                    response.removeAllListeners();
                });
                const asyncIterator = pubsub.asyncIterator(`${methodName}-onSubscribe`);
                return subscription_1.withAsyncIteratorCancel(asyncIterator, () => {
                    response.cancel();
                });
            }),
        };
        // eslint-disable-next-line no-param-reassign
        result[`${serviceName}${methodName}`] = subscribeField;
        return result;
    }, {});
    if (_.isEmpty(fields())) {
        return null;
    }
    return new graphql_1.GraphQLObjectType({
        name: 'Subscription',
        fields,
    });
}
exports.getGraphQlSubscriptionsFromProtoService = getGraphQlSubscriptionsFromProtoService;
//# sourceMappingURL=service_converter.js.map