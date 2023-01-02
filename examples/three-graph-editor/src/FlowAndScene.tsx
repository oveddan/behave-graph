import { Suspense, useState } from 'react';
import { Scene } from './scene/Scene';
import './styles/resizer.css';
import { CustomControls } from './components/CustomControls';
import useSetAndLoadModelFile, {
  exampleModelFileUrl
} from './hooks/useSetAndLoadModelFile';
import SplitEditor from './SplitEditor';
import { examplePairs } from './components/LoadModal';
import {
  registerSceneProfile,
  createSceneDependency,
  IRegistry
} from '@behave-graph/core';
import { useScene } from './scene/useScene';
import {
  useRegisterCoreProfileAndOthers,
  useBehaveGraphFlow,
  useGraphRunner,
  useNodeSpecJson,
  NodePicker,
  useFlowHandlers,
  useCustomNodeTypes,
  useCoreDependencies,
  useMergeDependencies,
  useDependency
} from '@behave-graph/flow';
import { suspend } from 'suspend-react';
import {
  exampleBehaveGraphFileUrl,
  fetchBehaviorGraphJson
} from './hooks/useSaveAndLoad';
import ReactFlow, { Background, BackgroundVariant } from 'reactflow';
import { useEffect } from 'react';
import { useWhyDidYouUpdate } from 'use-why-did-you-update';

const [initialModelFile, initialBehaviorGraph] = examplePairs[0];

const initialModelFileUrl = exampleModelFileUrl(initialModelFile);
const initialBehaviorGraphUrl = exampleBehaveGraphFileUrl(initialBehaviorGraph);

export const registerProfiles: ((
  registry: Pick<IRegistry, 'nodes' | 'values'>
) => void)[] = [registerSceneProfile];

export function Flow() {
  const { setModelFile, gltf } = useSetAndLoadModelFile({
    initialFileUrl: initialModelFileUrl
  });

  const { registry } = useRegisterCoreProfileAndOthers({
    otherRegisters:registerProfiles
  });

  const coreDependencies = useCoreDependencies();

  const { scene, animations, sceneOnClickListeners } = useScene(gltf);

  const sceneDependency = useDependency(scene, createSceneDependency);
  const dependencies = useMergeDependencies(coreDependencies, sceneDependency);

  const specJson = useNodeSpecJson({
    dependencies,
    registry
  });

  const initialGraphJson = suspend(async () => {
    return await fetchBehaviorGraphJson(initialBehaviorGraphUrl);
  }, []);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    graphJson,
    setGraphJson
  } = useBehaveGraphFlow({
    initialGraphJson,
    specJson
  });
  
  const { togglePlay, playing } = useGraphRunner({
    graphJson,
    registry,
    eventEmitter: coreDependencies.lifecycleEventEmitter,
    dependencies
  });

  const {
    onConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker,
    nodePickFilters
  } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange,
    specJSON: specJson
  });

  const customNodeTypes = useCustomNodeTypes({
    specJson
  });

  const [refreshFlow, setRefreshFlow] = useState(false);

  useEffect(() => {
    setRefreshFlow(true);
    setTimeout(() => setRefreshFlow(false));
  }, [customNodeTypes])

  const flowEditor = (customNodeTypes && !refreshFlow) && (
    <ReactFlow
      nodeTypes={customNodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={handleStartConnect}
      onConnectEnd={handleStopConnect}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
      onPaneClick={handlePaneClick}
      onPaneContextMenu={handlePaneContextMenu}
    >
      {specJson && (
      <CustomControls
        toggleRun={togglePlay}
        graphJson={graphJson}
        running={playing}
        setBehaviorGraph={setGraphJson}
        setModelFile={setModelFile}
      />)}
      <Background
        variant={BackgroundVariant.Lines}
        color="#2a2b2d"
        style={{ backgroundColor: '#1E1F22' }}
      />
      {nodePickerVisibility && (
        <NodePicker
          position={nodePickerVisibility}
          filters={nodePickFilters}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
          specJSON={specJson}
        />
      )}
    </ReactFlow>
  );

  const interactiveModelPreview = gltf && (
    <Scene
      gltf={gltf}
      onClickListeners={sceneOnClickListeners}
      animationsState={animations}
    />
  );

  return (
    <>
      <div className="w-full h-full relative">
        <SplitEditor left={flowEditor || <></>} right={interactiveModelPreview} />
      </div>
    </>
  );
}

export function FlowWrapper() {
  return (
    <Suspense fallback={null}>
      <Flow  />
    </Suspense>
  );
}
