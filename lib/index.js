"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var protobuf = require("protobufjs");
var _ = require("lodash");
var grpc_caller_1 = require("grpc-caller");
var graphql_1 = require("graphql");
var type_converter_1 = require("./type_converter");
var service_converter_1 = require("./service_converter");
var service_converter_2 = require("./service_converter");
exports.getGraphqlQueriesFromProtoService = service_converter_2.getGraphqlQueriesFromProtoService;
exports.getGraphQlSubscriptionsFromProtoService = service_converter_2.getGraphQlSubscriptionsFromProtoService;
var type_converter_2 = require("./type_converter");
exports.convertGrpcTypeToGraphqlType = type_converter_2.convertGrpcTypeToGraphqlType;
exports.getGraphqlTypeFromProtoDefinition = type_converter_2.getGraphqlTypeFromProtoDefinition;
var types_1 = require("./types");
exports.GRPC_GQL_TYPE_MAPPING = types_1.GRPC_GQL_TYPE_MAPPING;
exports.TypeDefinitionCache = types_1.TypeDefinitionCache;
function getGraphqlSchemaFromGrpc(_a) {
    var endpoint = _a.endpoint, protoFile = _a.protoFile, serviceName = _a.serviceName, packageName = _a.packageName;
    var client = grpc_caller_1.default(endpoint, path.resolve(__dirname, protoFile), serviceName, null, {
        'grpc.max_send_message_length': -1,
        'grpc.max_receive_message_length': -1,
    });
    var getProtobufDefPromise = protobuf
        .load(protoFile)
        .then(function (root) { return root.toJSON(); })
        .then(function (obj) {
        var packagePaths = packageName.split('.');
        for (var i = 0; i < packagePaths.length; i += 2) {
            packagePaths.splice(i, 0, 'nested');
        }
        return _.get(obj, packagePaths.join('.'));
    });
    return getProtobufDefPromise.then(function (_a) {
        var nested = _a.nested;
        var types = Object.keys(nested)
            .filter(function (key) { return 'fields' in nested[key]; })
            .reduce(function (acc, key) {
            var definition = nested[key];
            // skip empty
            if (key.startsWith('Empty')) {
                return acc;
            }
            return acc.concat([
                type_converter_1.getGraphqlTypeFromProtoDefinition({
                    definition: definition,
                    typeName: key,
                }),
            ]);
        }, []);
        var query = Object.keys(nested)
            .filter(function (key) { return 'methods' in nested[key] && key === serviceName; })
            .reduce(function (__, key) {
            var definition = nested[key];
            return service_converter_1.getGraphqlQueriesFromProtoService({
                definition: definition,
                serviceName: key,
                client: client,
            });
        }, null);
        var subscription = Object.keys(nested)
            .filter(function (key) { return 'methods' in nested[key] && key === serviceName; })
            .reduce(function (__, key) {
            var definition = nested[key];
            return service_converter_1.getGraphQlSubscriptionsFromProtoService({
                definition: definition,
                serviceName: key,
                client: client,
            });
        }, null);
        return new graphql_1.GraphQLSchema({
            query: query,
            types: types,
            subscription: subscription,
        });
    });
}
exports.getGraphqlSchemaFromGrpc = getGraphqlSchemaFromGrpc;
//# sourceMappingURL=index.js.map