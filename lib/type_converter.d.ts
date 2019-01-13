import * as protobuf from 'protobufjs';
import { GraphQLInputObjectType, GraphQLObjectType } from 'graphql';
interface ProtoDefinitionInput {
    definition: protobuf.IType;
    typeName: string;
}
export declare function convertGrpcTypeToGraphqlType(payload: any, typeDef: any): any;
export declare function getGraphqlTypeFromProtoDefinition({ definition, typeName }: ProtoDefinitionInput): GraphQLInputObjectType | GraphQLObjectType;
export {};
