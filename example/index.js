const path = require('path');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const { getGraphqlSchemaFromGrpc } = require('grpc-graphql-schema');

getGraphqlSchemaFromGrpc({
  endpoint: 'localhost:50051',
  protoFilePath: path.resolve(__dirname, 'grpc', 'proto', 'Example.proto'),
  serviceName: 'Example',
  packageName: 'io.xtech.example',
}).then((schema) => {
  const pubsub = new PubSub();
  const server = new GraphQLServer({
    schema,
    context: {
      pubsub,
    },
  });
  server.start({
    port: 4000,
  }, () => console.log('server started on port 4000'));
});