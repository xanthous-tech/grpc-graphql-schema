// package: io.xtech.example
// file: KafkaService.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as KafkaService_pb from "./KafkaService_pb";

interface IKafkaServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getConvos: IKafkaServiceService_IGetConvos;
}

interface IKafkaServiceService_IGetConvos extends grpc.MethodDefinition<KafkaService_pb.EmptyRequest, KafkaService_pb.ConvoText> {
    path: string; // "/io.xtech.example.KafkaService/GetConvos"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<KafkaService_pb.EmptyRequest>;
    requestDeserialize: grpc.deserialize<KafkaService_pb.EmptyRequest>;
    responseSerialize: grpc.serialize<KafkaService_pb.ConvoText>;
    responseDeserialize: grpc.deserialize<KafkaService_pb.ConvoText>;
}

export const KafkaServiceService: IKafkaServiceService;

export interface IKafkaServiceServer {
    getConvos: grpc.handleServerStreamingCall<KafkaService_pb.EmptyRequest, KafkaService_pb.ConvoText>;
}

export interface IKafkaServiceClient {
    getConvos(request: KafkaService_pb.EmptyRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<KafkaService_pb.ConvoText>;
    getConvos(request: KafkaService_pb.EmptyRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<KafkaService_pb.ConvoText>;
}

export class KafkaServiceClient extends grpc.Client implements IKafkaServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getConvos(request: KafkaService_pb.EmptyRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<KafkaService_pb.ConvoText>;
    public getConvos(request: KafkaService_pb.EmptyRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<KafkaService_pb.ConvoText>;
}
