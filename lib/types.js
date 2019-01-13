"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.GRPC_GQL_TYPE_MAPPING = {
    int32: graphql_1.GraphQLInt,
    int64: graphql_1.GraphQLFloat,
    float: graphql_1.GraphQLFloat,
    double: graphql_1.GraphQLFloat,
    string: graphql_1.GraphQLString,
};
exports.TypeDefinitionCache = {
    ServerStatus: new graphql_1.GraphQLObjectType({
        name: 'ServerStatus',
        fields: function () { return ({
            status: {
                type: graphql_1.GraphQLString,
            },
        }); },
    }),
};
//# sourceMappingURL=types.js.map