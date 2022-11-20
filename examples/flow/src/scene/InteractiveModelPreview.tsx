import { ObjectMap } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { GraphJSON } from 'behave-graph';
import { useGLTF } from '@react-three/drei';
import useLoadSceneAndRegistry from '../hooks/useLoadSceneAndRegistry';
import Scene from './Scene';
import { dataUrlFromFile } from '../hooks/useGraphJsonFlow';
import { useSceneModificationEngine } from '../hooks/behaviorFlow';

const Inner = ({ fileDataUrl, graphJson }: { fileDataUrl: string; graphJson: GraphJSON }) => {
  const gltf = useGLTF(fileDataUrl);

  const { animations, sceneOnClickListeners, lifecyleEmitter, registry } = useLoadSceneAndRegistry({
    gltf
  });

  useSceneModificationEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
    autoRun: true
  });

  return <Scene gltf={gltf} onClickListeners={sceneOnClickListeners} animationsState={animations} />;
};

const InteractiveModelPreview = ({ file, graphJson }: { file: File; graphJson: GraphJSON }) => {
  const [fileDataUrl, setFileDataUrl] = useState<string>();

  useEffect(() => {
    (async () => {
      setFileDataUrl(await dataUrlFromFile(file));
    })();
  }, [file]);

  if (!fileDataUrl) return null;

  return <Inner fileDataUrl={fileDataUrl} graphJson={graphJson} />;
};

export default InteractiveModelPreview;
