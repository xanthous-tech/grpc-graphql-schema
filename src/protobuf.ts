import * as _ from 'lodash';
import * as protobuf from 'protobufjs';

export async function getPackageProtoDefinition(
  protoFile: string,
  packageName: string,
): Promise<protobuf.AnyNestedObject> {
  const protoDefinition = await protobuf.load(protoFile);
  const protoDefinitionObject = await protoDefinition.toJSON({
    keepComments: true,
  });
  console.log(JSON.stringify(protoDefinitionObject, null, 2));
  const packagePaths: string[] = packageName.split('.');

  for (let i: number = 0; i < packagePaths.length; i += 2) {
    packagePaths.splice(i, 0, 'nested');
  }

  return _.get(protoDefinitionObject, packagePaths.join('.'));
}
