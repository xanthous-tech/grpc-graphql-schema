# Grpc Graphql Schema

<p align="center">
	<img src="https://raw.githubusercontent.com/xanthous-tech/grpc-graphql-schema/master/grpcgraphql.png">
</p>

Convert gRPC proto Definition into GraphQL Schema

[Slides @ GraphQL BKK 4.0](https://docs.google.com/presentation/d/11sw3yK7p6xYcES9Wsjco7z3lGgmYlefnNrqhZ6vaYvA/edit?usp=sharing)

[Medium Article](https://medium.com/xanthous/translating-grpc-services-into-graphql-6a8e49556d96)

# How to Use

```javascript
const { getGraphqlSchemaFromGrpc } = require('grpc-graphql-schema');

getGraphqlSchemaFromGrpc({
  endpoint: 'localhost:50051',
  protoFilePath: '/path/to/ServiceDefinition.proto',
  serviceName: 'GrpcServiceName',
  packageName: 'name.package',
}).then(schema => {
  // load schema in graphql server
});
```
