#!/usr/bin/env node

import * as debug from "debug";
import * as grpc from "grpc";

import { ExampleService, IExampleServer } from "./proto/Example_grpc_pb";
import { EmptyRequest, Movie, MoviesResult, SearchByCastInput } from "./proto/Example_pb";

const log = debug("SampleServer");

class ServerImpl implements IExampleServer {
  public getMovies(request: grpc.ServerUnaryCall<EmptyRequest>, callback: grpc.sendUnaryData<MoviesResult>) {
    callback(new Error(""), null);
  }

  public searchMoviesByCast(call: grpc.ServerWriteableStream<SearchByCastInput>) {
    call.end();
  }
}

function startServer() {
  const server = new grpc.Server();

  server.addService(ExampleService, new ServerImpl());
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
