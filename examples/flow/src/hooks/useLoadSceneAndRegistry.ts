import { ObjectMap } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import useSceneModifier from '../scene/useSceneModifier';
import { useRegistry } from './behaviorFlow';

const useLoadSceneAndRegistry = ({
  gltf,
}: {
  gltf?: GLTF & ObjectMap;
}) => {
  const { scene, animations, sceneOnClickListeners } = useSceneModifier(gltf);

  const { registry, specJson, lifecyleEmitter } = useRegistry({ scene });

  return {
    scene,
    animations,
    sceneOnClickListeners,
    registry,
    specJson,
    lifecyleEmitter,
  };
};

export default useLoadSceneAndRegistry;
