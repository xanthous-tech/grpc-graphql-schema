"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Long = require("long");
var graphql_1 = require("graphql");
var types_1 = require("./types");
function convertToGraphqlType(value) {
    if (Long.isLong(value)) {
        // conver long
        return value.toNumber();
    }
    return value;
}
// TODO: this convert method is not complete
function convertGrpcTypeToGraphqlType(payload, typeDef) {
    var fields = typeDef.getFields();
    Object.keys(fields).forEach(function (key) {
        var value = payload[key];
        var field = fields[key];
        var fieldType = field.type;
        if (graphql_1.isListType(fieldType)) {
            // process list
            // eslint-disable-next-line no-param-reassign
            payload[key] = value.map(convertToGraphqlType);
        }
        else {
            // eslint-disable-next-line no-param-reassign
            payload[key] = convertToGraphqlType(value);
        }
    });
    return payload;
}
exports.convertGrpcTypeToGraphqlType = convertGrpcTypeToGraphqlType;
function getGraphqlTypeFromProtoDefinition(_a) {
    var definition = _a.definition, typeName = _a.typeName;
    var fields = definition.fields, comment = definition.comment;
    // TODO: need to set up for either input type or object type
    var fieldsFunction = function () { return Object.keys(fields)
        .reduce(function (result, fieldName) {
        var _a = fields[fieldName], rule = _a.rule, type = _a.type, comment = _a.comment;
        var gqlType = types_1.GRPC_GQL_TYPE_MAPPING[type] || types_1.typeDefinitionCache[type];
        // eslint-disable-next-line no-param-reassign
        result[fieldName] = {
            type: rule === 'repeated' ? graphql_1.GraphQLList(gqlType) : gqlType,
            description: comment,
        };
        return result;
    }, {}); };
    var typeDef = {
        name: typeName,
        fields: fieldsFunction,
        description: comment,
    };
    // CONVENTION - types that end with `Input` are GraphQL input types
    var type = typeName.endsWith('Input')
        ? new graphql_1.GraphQLInputObjectType(typeDef)
        : new graphql_1.GraphQLObjectType(typeDef);
    types_1.typeDefinitionCache[typeName] = type;
    return type;
}
exports.getGraphqlTypeFromProtoDefinition = getGraphqlTypeFromProtoDefinition;
//# sourceMappingURL=type_converter.js.map