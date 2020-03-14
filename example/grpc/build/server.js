#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const grpc = require("grpc");
const Example_grpc_pb_1 = require("./proto/Example_grpc_pb");
const Example_pb_1 = require("./proto/Example_pb");
const log = debug("SampleServer");
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
function createMovie(movie) {
    const result = new Example_pb_1.Movie();
    result.setCastList(movie.cast);
    result.setName(movie.name);
    result.setYear(movie.year);
    result.setRating(movie.rating);
    return result;
}
class ServerImpl {
    getMovies(request, callback) {
        const result = new Example_pb_1.MoviesResult();
        Movies.map(createMovie).forEach((movie) => result.addResult(movie));
        callback(null, result);
    }
    searchMoviesByCast(call) {
        log("call started");
        const input = call.request;
        let i = 1;
        call.on("error", (error) => {
            log(error);
            call.end();
        });
        Movies.map(createMovie).forEach((movie) => {
            if (movie.getCastList().indexOf(input.getCastname()) > -1) {
                setTimeout(() => {
                    log(movie.getName());
                    call.write(movie);
                }, i * 1000);
                i += 1;
            }
        });
        setTimeout(() => {
            call.end();
            log("call ended");
        }, 3000);
    }
}
function startServer() {
    const server = new grpc.Server();
    server.addService(Example_grpc_pb_1.ExampleService, new ServerImpl());
    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    server.start();
    log("Server started, listening: 0.0.0.0:50051");
}
startServer();
process.on("uncaughtException", (err) => {
    log(`process on uncaughtException error: ${err}`);
});
process.on("unhandledRejection", (err) => {
    log(`process on unhandledRejection error: ${err}`);
});
//# sourceMappingURL=server.js.map