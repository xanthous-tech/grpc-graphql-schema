"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var grpcCaller = require("grpc-caller");
var graphql_1 = require("graphql");
var type_converter_1 = require("./type_converter");
var service_converter_1 = require("./service_converter");
var protobuf_1 = require("./protobuf");
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
function getGraphqlSchemaFromGrpc(_a) {
    var endpoint = _a.endpoint, protoFilePath = _a.protoFilePath, serviceName = _a.serviceName, packageName = _a.packageName;
    return __awaiter(this, void 0, void 0, function () {
        var client, nested, types, query, mutation, subscription;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = grpcCaller(endpoint, protoFilePath, serviceName, null, {
                        'grpc.max_send_message_length': -1,
                        'grpc.max_receive_message_length': -1,
                    });
                    return [4 /*yield*/, protobuf_1.getPackageProtoDefinition(protoFilePath, packageName)];
                case 1:
                    nested = (_b.sent()).nested;
                    types = Object.keys(nested)
                        .filter(function (key) { return 'fields' in nested[key]; })
                        .reduce(function (acc, key) {
                        var definition = nested[key];
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
                    query = Object.keys(nested)
                        .filter(function (key) { return 'methods' in nested[key] && key === serviceName; })
                        .reduce(function (__, key) {
                        var definition = nested[key];
                        return service_converter_1.getGraphqlQueriesFromProtoService({
                            client: client,
                            definition: definition,
                            serviceName: key,
                        });
                    }, null);
                    mutation = Object.keys(nested)
                        .filter(function (key) { return 'methods' in nested[key] && key === serviceName; })
                        .reduce(function (__, key) {
                        var definition = nested[key];
                        return service_converter_1.getGraphqlMutationsFromProtoService({
                            client: client,
                            definition: definition,
                            serviceName: key,
                        });
                    }, null);
                    subscription = Object.keys(nested)
                        .filter(function (key) { return 'methods' in nested[key] && key === serviceName; })
                        .reduce(function (__, key) {
                        var definition = nested[key];
                        return service_converter_1.getGraphQlSubscriptionsFromProtoService({
                            client: client,
                            definition: definition,
                            serviceName: key,
                        });
                    }, null);
                    return [2 /*return*/, new graphql_1.GraphQLSchema({
                            types: types,
                            query: query,
                            mutation: mutation,
                            subscription: subscription,
                        })];
            }
        });
    });
}
exports.getGraphqlSchemaFromGrpc = getGraphqlSchemaFromGrpc;
//# sourceMappingURL=index.js.map