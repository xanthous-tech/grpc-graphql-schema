"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _ = require("lodash");
var graphql_1 = require("graphql");
var subscription_1 = require("./subscription");
var type_converter_1 = require("./type_converter");
var types_1 = require("./types");
function getGraphqlQueriesFromProtoService(_a) {
    var _this = this;
    var definition = _a.definition, serviceName = _a.serviceName, client = _a.client;
    var methods = definition.methods;
    var fields = function () { return Object.keys(methods).reduce(function (result, methodName) {
        var args = {};
        var _a = methods[methodName], requestArgName = _a.requestType, responseType = _a.responseType, responseStream = _a.responseStream;
        if (responseStream) {
            // responseStream should be in subscriptions
            return result;
        }
        if (!requestArgName.startsWith('Empty')) {
            args[requestArgName] = {
                type: types_1.TypeDefinitionCache[requestArgName],
            };
        }
        var queryField = {
            type: types_1.TypeDefinitionCache[responseType],
            args: args,
            resolve: function (__, arg) { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client[methodName](arg[requestArgName] || {}, {}, {
                                deadline: Date.now() + (Number(process.env.REQUEST_TIMEOUT) || 200000),
                            })];
                        case 1:
                            response = _a.sent();
                            // FIXME: there is a bug in the graphQL type conversion, I think this is fine for now
                            return [2 /*return*/, response];
                    }
                });
            }); },
        };
        // eslint-disable-next-line no-param-reassign
        result["" + serviceName + methodName] = queryField;
        return result;
    }, {
        // adding a default ping
        ping: {
            type: types_1.TypeDefinitionCache.ServerStatus,
            resolve: function () { return ({ status: 'online' }); },
        },
    }); };
    return new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: fields,
    });
}
exports.getGraphqlQueriesFromProtoService = getGraphqlQueriesFromProtoService;
function getGraphQlSubscriptionsFromProtoService(_a) {
    var _this = this;
    var definition = _a.definition, serviceName = _a.serviceName, client = _a.client;
    var methods = definition.methods;
    var fields = function () { return Object.keys(methods).reduce(function (result, methodName) {
        var args = {};
        var _a = methods[methodName], requestArgName = _a.requestType, responseType = _a.responseType, responseStream = _a.responseStream;
        if (!responseStream) {
            // non-responseStream should be in queries / mutations
            return result;
        }
        if (!requestArgName.startsWith('Empty')) {
            args[requestArgName] = {
                type: types_1.TypeDefinitionCache[requestArgName],
            };
        }
        var subscribeField = {
            type: types_1.TypeDefinitionCache[responseType],
            args: args,
            subscribe: function (__, arg, _a) {
                var pubsub = _a.pubsub;
                return __awaiter(_this, void 0, void 0, function () {
                    var response, asyncIterator;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client[methodName](arg[requestArgName] || {}, {})];
                            case 1:
                                response = _b.sent();
                                response.on('data', function (data) {
                                    var payload = {};
                                    payload["" + serviceName + methodName] = type_converter_1.convertGrpcTypeToGraphqlType(data, types_1.TypeDefinitionCache[responseType]);
                                    pubsub.publish(methodName + "-onSubscribe", payload);
                                });
                                response.on('error', function (error) {
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
                                response.on('end', function () {
                                    // debug('stream ended');
                                    response.removeAllListeners();
                                    // debug('all listeners removed');
                                });
                                asyncIterator = pubsub.asyncIterator(methodName + "-onSubscribe");
                                return [2 /*return*/, subscription_1.withAsyncIteratorCancel(asyncIterator, function () {
                                        // debug('on cancel');
                                        response.cancel();
                                        // debug('on cancel done');
                                    })];
                        }
                    });
                });
            },
        };
        // eslint-disable-next-line no-param-reassign
        result["" + serviceName + methodName] = subscribeField;
        return result;
    }, {}); };
    if (_.isEmpty(fields())) {
        return null;
    }
    return new graphql_1.GraphQLObjectType({
        name: 'Subscription',
        fields: fields,
    });
}
exports.getGraphQlSubscriptionsFromProtoService = getGraphQlSubscriptionsFromProtoService;
//# sourceMappingURL=service_converter.js.map