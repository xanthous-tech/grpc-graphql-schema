import { GraphQLObjectType } from 'graphql';
export declare function getGraphqlQueriesFromProtoService({ definition, serviceName, client, }: {
    definition: any;
    serviceName: any;
    client: any;
}): GraphQLObjectType<any, any, {
    [key: string]: any;
}>;
export declare function getGraphqlMutationsFromProtoService({ definition, serviceName, client, }: {
    definition: any;
    serviceName: any;
    client: any;
}): GraphQLObjectType<any, any, {
    [key: string]: any;
}>;
export declare function getGraphQlSubscriptionsFromProtoService({ definition, serviceName, client, }: {
    definition: any;
    serviceName: any;
    client: any;
}): GraphQLObjectType<any, any, {
    [key: string]: any;
}>;
