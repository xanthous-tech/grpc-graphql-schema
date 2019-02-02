"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const protobuf = require("protobufjs");
function getPackageProtoDefinition(protoFile, packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const protoDefinition = yield protobuf.load(protoFile);
        const protoDefinitionObject = yield protoDefinition.toJSON({
            keepComments: true,
        });
        console.log(JSON.stringify(protoDefinitionObject, null, 2));
        const packagePaths = packageName.split('.');
        for (let i = 0; i < packagePaths.length; i += 2) {
            packagePaths.splice(i, 0, 'nested');
        }
        return _.get(protoDefinitionObject, packagePaths.join('.'));
    });
}
exports.getPackageProtoDefinition = getPackageProtoDefinition;
//# sourceMappingURL=protobuf.js.map