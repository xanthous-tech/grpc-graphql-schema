# Grpc Graphql Schema

<p align="center">
	<img src="https://raw.githubusercontent.com/xanthous-tech/grpc-graphql-schema/master/grpcgraphql.png">
</p>

Convert gRPC proto Definition into GraphQL Schema

# How to Use

```javascript
const { getGraphqlSchemaFromGrpc } = require('grpc-graphql-schema');

getGraphqlSchemaFromGrpc({
  endpoint: 'localhost:50051',
  protoFile: '/path/to/ServiceDefinition.proto',
  serviceName: 'GrpcServiceName',
  packageName: 'name.package',
}).then(schema => {
  // load schema in graphql server
});
```
