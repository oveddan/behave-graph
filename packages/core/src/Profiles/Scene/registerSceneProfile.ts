/* eslint-disable max-len */
import { Dependencies } from '../../Nodes/Registry/DependenciesRegistry';
import { getNodeDescriptions } from '../../Nodes/Registry/NodeDescription';
import { IRegistry } from '../../Registry';
import { registerSerializersForValueType } from '../Core/registerSerializersForValueType';
import { IScene } from './Abstractions/IScene';
import { SetSceneProperty } from './Actions/SetSceneProperty';
import { sceneDepdendencyKey } from './dependencies';
import { OnSceneNodeClick } from './Events/OnSceneNodeClick';
import { GetSceneProperty } from './Queries/GetSceneProperty';
import * as ColorNodes from './Values/ColorNodes';
import { ColorValue } from './Values/ColorValue';
import * as EulerNodes from './Values/EulerNodes';
import { EulerValue } from './Values/EulerValue';
import * as Mat3Nodes from './Values/Mat3Nodes';
import { Mat3Value } from './Values/Mat3Value';
import * as Mat4Nodes from './Values/Mat4Nodes';
import { Mat4Value } from './Values/Mat4Value';
import * as QuatNodes from './Values/QuatNodes';
import { QuatValue } from './Values/QuatValue';
import * as Vec2Nodes from './Values/Vec2Nodes';
import { Vec2Value } from './Values/Vec2Value';
import * as Vec3Nodes from './Values/Vec3Nodes';
import { Vec3Value } from './Values/Vec3Value';
import * as Vec4Nodes from './Values/Vec4Nodes';
import { Vec4Value } from './Values/Vec4Value';

<<<<<<< HEAD
export function registerSceneDependency(
  dependencies: IRegistry['dependencies'],
  scene: IScene
) {
  dependencies.register('scene', scene);
}
=======
export const createSceneDependency = (scene: IScene): Dependencies => ({
  [sceneDepdendencyKey]: scene
});
>>>>>>> a5e9a60 (Migrated scene based nodes to use dependencies for IScene)

export function registerSceneProfile(
  registry: Pick<IRegistry, 'values' | 'nodes'>
) {
  const { values, nodes } = registry;

  // pull in value type nodes
  values.register(Vec2Value);
  values.register(Vec3Value);
  values.register(Vec4Value);
  values.register(ColorValue);
  values.register(EulerValue);
  values.register(QuatValue);
  values.register(Mat3Value);
  values.register(Mat4Value);

  // pull in value type nodes
  nodes.register(...getNodeDescriptions(Vec2Nodes));
  nodes.register(...getNodeDescriptions(Vec3Nodes));
  nodes.register(...getNodeDescriptions(Vec4Nodes));
  nodes.register(...getNodeDescriptions(ColorNodes));
  nodes.register(...getNodeDescriptions(EulerNodes));
  nodes.register(...getNodeDescriptions(QuatNodes));
  nodes.register(...getNodeDescriptions(Mat3Nodes));
  nodes.register(...getNodeDescriptions(Mat4Nodes));

  // events

  nodes.register(OnSceneNodeClick);

  // actions
  const allValueTypeNames = values.getAllNames();
  nodes.register(...SetSceneProperty(allValueTypeNames));
  nodes.register(...GetSceneProperty(allValueTypeNames));

  const newValueTypeNames = [
    'vec2',
    'vec3',
    'vec4',
    'quat',
    'euler',
    'color',
    'mat3',
    'mat4'
  ];

  // variables

  newValueTypeNames.forEach((valueTypeName) => {
    registerSerializersForValueType(registry, valueTypeName);
  });

  return registry;
}
