import * as protobuf from 'protobufjs';
import { GraphQLInputObjectType, GraphQLObjectType } from 'graphql';
interface IFieldWithComment extends protobuf.IField {
    comment?: string | null | undefined;
}
interface ITypeWithComment extends protobuf.IType {
    fields: {
        [k: string]: IFieldWithComment;
    };
    comment?: string | null | undefined;
}
interface ProtoDefinitionInput {
    definition: ITypeWithComment;
    typeName: string;
}
export declare function convertGrpcTypeToGraphqlType(payload: any, typeDef: any): any;
export declare function getGraphqlTypeFromProtoDefinition({ definition, typeName }: ProtoDefinitionInput): GraphQLInputObjectType | GraphQLObjectType;
export {};
