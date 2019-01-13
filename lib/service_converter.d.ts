import { GraphQLObjectType } from 'graphql';
export declare function getGraphqlQueriesFromProtoService({ definition, serviceName, client, }: {
    definition: any;
    serviceName: any;
    client: any;
}): GraphQLObjectType;
export declare function getGraphQlSubscriptionsFromProtoService({ definition, serviceName, client, }: {
    definition: any;
    serviceName: any;
    client: any;
}): GraphQLObjectType;
