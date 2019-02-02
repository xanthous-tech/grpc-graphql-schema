"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
const graphql_1 = require("graphql");
const types_1 = require("./types");
function convertToGraphqlType(value) {
    if (Long.isLong(value)) {
        // conver long
        return value.toNumber();
    }
    return value;
}
// TODO: this convert method is not complete
function convertGrpcTypeToGraphqlType(payload, typeDef) {
    const fields = typeDef.getFields();
    Object.keys(fields).forEach((key) => {
        const value = payload[key];
        const field = fields[key];
        const fieldType = field.type;
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
function getGraphqlTypeFromProtoDefinition({ definition, typeName }) {
    const { fields, comment } = definition;
    // TODO: need to set up for either input type or object type
    const fieldsFunction = () => Object.keys(fields)
        .reduce((result, fieldName) => {
        const { rule, type, comment } = fields[fieldName];
        const gqlType = types_1.GRPC_GQL_TYPE_MAPPING[type] || types_1.typeDefinitionCache[type];
        // eslint-disable-next-line no-param-reassign
        result[fieldName] = {
            type: rule === 'repeated' ? graphql_1.GraphQLList(gqlType) : gqlType,
            description: comment,
        };
        return result;
    }, {});
    const typeDef = {
        name: typeName,
        fields: fieldsFunction,
        description: comment,
    };
    // CONVENTION - types that end with `Input` are GraphQL input types
    const type = typeName.endsWith('Input')
        ? new graphql_1.GraphQLInputObjectType(typeDef)
        : new graphql_1.GraphQLObjectType(typeDef);
    types_1.typeDefinitionCache[typeName] = type;
    return type;
}
exports.getGraphqlTypeFromProtoDefinition = getGraphqlTypeFromProtoDefinition;
//# sourceMappingURL=type_converter.js.map