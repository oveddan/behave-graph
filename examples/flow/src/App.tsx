import { Suspense, useCallback, useEffect, useState, useRef } from 'react';
import FlowEditor from './flowEditor/FlowEditor';
import { useRegistry } from './hooks/useRegistry';
import Scene from './scene/Scene';
import SplitPane from 'react-split-pane';
import { VscSplitVertical, VscSplitHorizontal } from 'react-icons/vsc';
import clsx from 'clsx';
import Controls from './flowEditor/components/Controls';
import useGraphJsonFlow from './hooks/useGraphJsonFlow';
import GltfLoader from './scene/GltfLoader';

import '@rainbow-me/rainbowkit/styles.css';
import './styles/resizer.css';
import useSetAndLoadModelFile from './hooks/useSetAndLoadModelFile';
import useSceneModifier from './scene/useSceneModifier';
import useNodeSpecJson from './hooks/useNodeSpecJson';
import { useEngine } from './hooks/useEngine';
import SplitEditor from './flowEditor/components/SplitEditor';

function App() {

  const { modelFile, setModelFile, gltf, setGltf  } = useSetAndLoadModelFile();

  const { scene, animations, sceneOnClickListeners, registerSceneProfile } = useSceneModifier(gltf);

  const { registry, lifecyleEmitter } = useRegistry({
    registerProfiles: registerSceneProfile
  });

  const specJson = useNodeSpecJson(registry);

  const { nodes, edges, onNodesChange, onEdgesChange, graphJson, handleGraphJsonLoaded } = useGraphJsonFlow(specJson);

  const { togglePlay, playing} = useEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
  });

  const controls = specJson && (
    <Controls
      toggleRun={togglePlay}
      specJson={specJson}
      running={playing}
      setModelFile={setModelFile}
      handleGraphJsonLoaded={handleGraphJsonLoaded}
    />
  );

  const flowEditor = controls && scene && (
    <FlowEditor
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        specJson={specJson}
        scene={scene}
        controls={controls}
      />
    )

  const interactiveModelPreview = modelFile && <Scene gltf={gltf} onClickListeners={sceneOnClickListeners} animationsState={animations} />

  if (interactiveModelPreview) 
    return (
        <>
          <div className="w-full h-full relative" >
            <SplitEditor 
              left={flowEditor}   
              right={interactiveModelPreview}
            />
          </div>
          {/* @ts-ignore */}
          <GltfLoader fileUrl={modelFile?.dataUri} setGltf={setGltf} />
      </>
    );

  return (
    <>
      <div className="w-full h-full relative">
         {flowEditor}
      </div>
    </>
  )
}

function AppWrapper() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

export default AppWrapper;
