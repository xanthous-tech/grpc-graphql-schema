import { GraphQLType } from 'graphql';
export interface GrpcGraphqlSchemaConfiguration {
    endpoint: string;
    protoFilePath: string;
    serviceName: string;
    packageName: string;
}
export interface TypeMapping {
    [key: string]: GraphQLType;
}
export declare const GRPC_GQL_TYPE_MAPPING: TypeMapping;
export declare const typeDefinitionCache: TypeMapping;
