import { Suspense, useEffect } from 'react';
import { Flow, CustomControls, useRegistry, useBehaveGraphFlow, useNodeSpecJson, useEngine} from '@behave-graph/flow';
import Scene from './scene/Scene';
import GltfLoader from './scene/GltfLoader';

import './styles/resizer.css';
import useSetAndLoadModelFile from './hooks/useSetAndLoadModelFile';
import useSceneModifier from './scene/useSceneModifier';
import SplitEditor from './components/SplitEditor';
import LoadAndSaveModelControls from './components/LoadAndSaveModelControls';

import 'reactflow/dist/style.css';
import '@behave-graph/flow/dist/index.css';

function App() {

  const { modelFile, setModelFile, gltf, setGltf  } = useSetAndLoadModelFile();

  const { scene, animations, sceneOnClickListeners, registerSceneProfile } = useSceneModifier(gltf);

  const { registry, lifecyleEmitter } = useRegistry({
    registerProfiles: registerSceneProfile
  });

  const specJson = useNodeSpecJson(registry);

  const { nodes, edges, onNodesChange, onEdgesChange, graphJson, setGraphJson: handleGraphJsonLoaded } = useBehaveGraphFlow(specJson);

  const { togglePlay, playing} = useEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
  });

  const loadAndSaveControls = <LoadAndSaveModelControls
    graphJson={graphJson}
    handleGraphJsonLoaded={handleGraphJsonLoaded}
    setModelFile={setModelFile}
  />

  const controls = (
    <CustomControls
      toggleRun={togglePlay}
      running={playing}
      additionalControls={loadAndSaveControls}
    />
  );

  const flowEditor = specJson && (
    <Flow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        specJson={specJson}
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
