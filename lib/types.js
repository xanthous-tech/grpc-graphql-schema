"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
// https://developers.google.com/protocol-buffers/docs/proto3#scalar
// https://www.apollographql.com/docs/apollo-server/schemas/types.html
exports.GRPC_GQL_TYPE_MAPPING = {
    int32: graphql_1.GraphQLInt,
    int64: graphql_1.GraphQLFloat,
    float: graphql_1.GraphQLFloat,
    double: graphql_1.GraphQLFloat,
    string: graphql_1.GraphQLString,
    bool: graphql_1.GraphQLBoolean,
};
exports.typeDefinitionCache = {
    ServerStatus: new graphql_1.GraphQLObjectType({
        name: 'ServerStatus',
        description: 'status of the server',
        fields: () => ({
            status: {
                type: graphql_1.GraphQLString,
                descripton: 'status string',
            },
        }),
    }),
};
//# sourceMappingURL=types.js.map