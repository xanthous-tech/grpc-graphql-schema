#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const grpc = require("grpc");
const Example_grpc_pb_1 = require("./proto/Example_grpc_pb");
const log = debug("SampleServer");
class ServerImpl {
    getMovies(request, callback) {
        callback(new Error(""), null);
    }
    searchMoviesByCast(call) {
        call.end();
    }
}
function startServer() {
    const server = new grpc.Server();
    server.addService(Example_grpc_pb_1.ExampleService, new ServerImpl());
    server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
    server.start();
    log("Server started, listening: 127.0.0.1:50051");
}
startServer();
process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});
process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
//# sourceMappingURL=server.js.map