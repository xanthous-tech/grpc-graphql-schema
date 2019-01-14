// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var KafkaService_pb = require('./KafkaService_pb.js');

function serialize_io_xtech_example_ConvoText(arg) {
  if (!(arg instanceof KafkaService_pb.ConvoText)) {
    throw new Error('Expected argument of type io.xtech.example.ConvoText');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_io_xtech_example_ConvoText(buffer_arg) {
  return KafkaService_pb.ConvoText.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_io_xtech_example_EmptyRequest(arg) {
  if (!(arg instanceof KafkaService_pb.EmptyRequest)) {
    throw new Error('Expected argument of type io.xtech.example.EmptyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_io_xtech_example_EmptyRequest(buffer_arg) {
  return KafkaService_pb.EmptyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var KafkaServiceService = exports.KafkaServiceService = {
  getConvos: {
    path: '/io.xtech.example.KafkaService/GetConvos',
    requestStream: false,
    responseStream: true,
    requestType: KafkaService_pb.EmptyRequest,
    responseType: KafkaService_pb.ConvoText,
    requestSerialize: serialize_io_xtech_example_EmptyRequest,
    requestDeserialize: deserialize_io_xtech_example_EmptyRequest,
    responseSerialize: serialize_io_xtech_example_ConvoText,
    responseDeserialize: deserialize_io_xtech_example_ConvoText,
  },
};

exports.KafkaServiceClient = grpc.makeGenericClientConstructor(KafkaServiceService);
