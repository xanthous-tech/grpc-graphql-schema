// package: io.xtech.example
// file: KafkaService.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class ConvoText extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): void;

    getConvo(): string;
    setConvo(value: string): void;

    clearTokenizedList(): void;
    getTokenizedList(): Array<string>;
    setTokenizedList(value: Array<string>): void;
    addTokenized(value: string, index?: number): string;

    clearWord2vecList(): void;
    getWord2vecList(): Array<number>;
    setWord2vecList(value: Array<number>): void;
    addWord2vec(value: number, index?: number): number;

    clearClassprobabilitiesList(): void;
    getClassprobabilitiesList(): Array<number>;
    setClassprobabilitiesList(value: Array<number>): void;
    addClassprobabilities(value: number, index?: number): number;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConvoText.AsObject;
    static toObject(includeInstance: boolean, msg: ConvoText): ConvoText.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConvoText, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConvoText;
    static deserializeBinaryFromReader(message: ConvoText, reader: jspb.BinaryReader): ConvoText;
}

export namespace ConvoText {
    export type AsObject = {
        timestamp: number,
        convo: string,
        tokenizedList: Array<string>,
        word2vecList: Array<number>,
        classprobabilitiesList: Array<number>,
    }
}

export class EmptyRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EmptyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EmptyRequest;
    static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
    export type AsObject = {
    }
}
