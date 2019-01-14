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
const grpcCaller = require("grpc-caller");
const graphql_1 = require("graphql");
const type_converter_1 = require("./type_converter");
const service_converter_1 = require("./service_converter");
const protobuf_1 = require("./protobuf");
var service_converter_2 = require("./service_converter");
exports.getGraphqlQueriesFromProtoService = service_converter_2.getGraphqlQueriesFromProtoService;
exports.getGraphqlMutationsFromProtoService = service_converter_2.getGraphqlMutationsFromProtoService;
exports.getGraphQlSubscriptionsFromProtoService = service_converter_2.getGraphQlSubscriptionsFromProtoService;
var type_converter_2 = require("./type_converter");
exports.convertGrpcTypeToGraphqlType = type_converter_2.convertGrpcTypeToGraphqlType;
exports.getGraphqlTypeFromProtoDefinition = type_converter_2.getGraphqlTypeFromProtoDefinition;
var types_1 = require("./types");
exports.GRPC_GQL_TYPE_MAPPING = types_1.GRPC_GQL_TYPE_MAPPING;
exports.typeDefinitionCache = types_1.typeDefinitionCache;
function getGraphqlSchemaFromGrpc({ endpoint, protoFilePath, serviceName, packageName, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = grpcCaller(endpoint, protoFilePath, serviceName, null, {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        const { nested } = yield protobuf_1.getPackageProtoDefinition(protoFilePath, packageName);
        const types = Object.keys(nested)
            .filter((key) => 'fields' in nested[key])
            .reduce((acc, key) => {
            const definition = nested[key];
            // skip empty
            if (key.startsWith('Empty')) {
                return acc;
            }
            if (definition.fields) {
                return acc.concat([
                    type_converter_1.getGraphqlTypeFromProtoDefinition({
                        definition: definition,
                        typeName: key,
                    }),
                ]);
            }
            return acc;
        }, []);
        const query = Object.keys(nested)
            .filter((key) => 'methods' in nested[key] && key === serviceName)
            .reduce((__, key) => {
            const definition = nested[key];
            return service_converter_1.getGraphqlQueriesFromProtoService({
                client,
                definition,
                serviceName: key,
            });
        }, null);
        const mutation = Object.keys(nested)
            .filter((key) => 'methods' in nested[key] && key === serviceName)
            .reduce((__, key) => {
            const definition = nested[key];
            return service_converter_1.getGraphqlMutationsFromProtoService({
                client,
                definition,
                serviceName: key,
            });
        }, null);
        const subscription = Object.keys(nested)
            .filter(key => 'methods' in nested[key] && key === serviceName)
            .reduce((__, key) => {
            const definition = nested[key];
            return service_converter_1.getGraphQlSubscriptionsFromProtoService({
                client,
                definition,
                serviceName: key,
            });
        }, null);
        return new graphql_1.GraphQLSchema({
            types,
            query,
            mutation,
            subscription,
        });
    });
}
exports.getGraphqlSchemaFromGrpc = getGraphqlSchemaFromGrpc;
//# sourceMappingURL=index.js.map