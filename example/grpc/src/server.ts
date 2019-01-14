#!/usr/bin/env node

import * as debug from "debug";
import * as grpc from "grpc";

import { ExampleService, IExampleServer } from "./proto/Example_grpc_pb";
import { EmptyRequest, Movie, MoviesResult, SearchByCastInput } from "./proto/Example_pb";

const log = debug("SampleServer");

interface IRawMovie {
  cast: string[];
  name: string;
  rating: number;
  year: number;
}

const Movies = [
  {
    cast: ["Tom Cruise", "Simon Pegg", "Jeremy Renner"],
    name: "Mission: Impossible Rogue Nation",
    rating: 0.97,
    year: 2015,
  },
  {
    cast: ["Tom Cruise", "Simon Pegg", "Henry Cavill"],
    name: "Mission: Impossible - Fallout",
    rating: 0.93,
    year: 2018,
  },
  {
    cast: ["Leonardo DiCaprio", "Jonah Hill", "Margot Robbie"],
    name: "The Wolf of Wall Street",
    rating: 0.78,
    year: 2013,
  },
];

function createMovie(movie: IRawMovie): Movie {
  const result = new Movie();

  result.setCastList(movie.cast);
  result.setName(movie.name);
  result.setYear(movie.year);
  result.setRating(movie.rating);

  return result;
}

class ServerImpl implements IExampleServer {
  public getMovies(request: grpc.ServerUnaryCall<EmptyRequest>, callback: grpc.sendUnaryData<MoviesResult>) {
    const result = new MoviesResult();
    Movies.map(createMovie).forEach((movie: Movie) => result.addResult(movie));
    callback(null, result);
  }

  public searchMoviesByCast(call: grpc.ServerWriteableStream<SearchByCastInput>) {
    const input: SearchByCastInput = call.request;
    Movies.map(createMovie).forEach((movie: Movie) => {
      if (movie.getCastList().indexOf(input.getCastname()) > -1) {
        call.write(movie);
      }
    });
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
