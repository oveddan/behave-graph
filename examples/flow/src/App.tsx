import { Suspense, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import FlowEditor from './flowEditor/FlowEditorApp';
import { useSceneModificationEngine } from './hooks/behaviorFlow';
import Scene from './scene/Scene';
import { ObjectMap } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import { flowToBehave } from './flowEditor/transformers/flowToBehave';
import useLoadSceneAndRegistry from './hooks/useLoadSceneAndRegistry';
import SplitPane from 'react-split-pane';
import { VscSplitVertical, VscSplitHorizontal } from 'react-icons/vsc';
import clsx from 'clsx';
import Controls from './flowEditor/components/Controls';
import useGraphJsonFlow from './hooks/useGraphJsonFlow';
import GltfLoader from './scene/GltfLoader';

import '@rainbow-me/rainbowkit/styles.css';
import './styles/resizer.css';
import useSetAndLoadModelFile from './hooks/useSetAndLoadModelFile';

type splitDirection = 'vertical' | 'horizontal';

const TogglePaneButton = ({
  splitDirection,
  buttonSplitDirection,
  setSplitDirection,
  children,
}: TogglePangeButtonProps & {
  buttonSplitDirection: splitDirection;
  children: JSX.Element[];
}) => {
  const active = buttonSplitDirection === splitDirection;
  return (
    <button
      type="button"
      className={clsx('font-medium text-sm p-2 text-center inline-flex items-center mr-2', {
        'text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800':
          active,
        'text-gray-700 border border-gray-700 hover:bg-gray-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:focus:ring-gray-800':
          !active,
      })}
      onClick={() => setSplitDirection(buttonSplitDirection)}
    >
      {children}
    </button>
  );
};

type TogglePangeButtonProps = {
  splitDirection: 'vertical' | 'horizontal';
  setSplitDirection: (dir: splitDirection) => void;
};

const TogglePaneButtons = (props: TogglePangeButtonProps) => (
  <>
    <TogglePaneButton {...props} buttonSplitDirection="vertical">
      <VscSplitHorizontal />
      <span className="sr-only">Split Vertical</span>
    </TogglePaneButton>

    <TogglePaneButton {...props} buttonSplitDirection="horizontal">
      <VscSplitVertical />
      <span className="sr-only">Split Horizontal</span>
    </TogglePaneButton>
  </>
);

function App() {
  const saveAndLoadProps = useGraphJsonFlow();

  const [gltf, setGltf] = useState<GLTF & ObjectMap>();
  const { modelFile, setModelFile  } = useSetAndLoadModelFile();

  const { nodes, edges, onNodesChange, onEdgesChange, graphJson, setGraphJson } = saveAndLoadProps;

  const { scene, animations, sceneOnClickListeners, registry, specJson, lifecyleEmitter } = useLoadSceneAndRegistry({
    gltf
  });

  useEffect(() => {
    if (!specJson) return;
    const graphJson = flowToBehave({ nodes, edges, nodeSpecJSON: specJson });
    setGraphJson(graphJson);
  }, [nodes, edges, specJson]);

  const { togglePlay, playing} = useSceneModificationEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter,
  });

  const rightRef = useRef<HTMLDivElement | null>(null);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>();

  const handleSplitResized = useCallback(() => {
    if (rightRef.current) {
      const boundingRect = rightRef.current.getBoundingClientRect();
      setDimensions({
        height: boundingRect.height,
        width: boundingRect.width,
      });
    }
  }, []);

  const [splitDirection, setSplitDirection] = useState<splitDirection>('vertical');

  useEffect(() => {
    handleSplitResized();
  }, [handleSplitResized, splitDirection]);

  const controls = specJson && (
    <Controls
      toggleRun={togglePlay}
      specJson={specJson}
      running={playing}
      setModelFile={setModelFile}
      setGraphJson={setGraphJson}
    />
  );

  return (
    <>
      <div className="w-full h-full relative" >
        <div
          className={clsx('absolute right-2 z-50', {
            'top-14': splitDirection === 'horizontal',
            'top-2': splitDirection === 'vertical',
          })}
        >
          <TogglePaneButtons setSplitDirection={setSplitDirection} splitDirection={splitDirection} />
        </div>
        {/* @ts-ignore */}
        <SplitPane split={splitDirection} defaultSize={800} onChange={handleSplitResized}>
          <div className="w-full h-full">
            {controls && scene && (
              <FlowEditor
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                specJson={specJson}
                scene={scene}
                controls={controls}
              />
            )}
          </div>
          <div className="w-full h-full overflow-hidden" ref={rightRef}>
            {dimensions && (
              <div style={{ ...dimensions }} className="absolute z-40">
                <Scene gltf={gltf} onClickListeners={sceneOnClickListeners} animationsState={animations} />
              </div>
            )}
          </div>
        </SplitPane>
        <GltfLoader fileUrl={modelFile?.dataUri} setGltf={setGltf} />
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

export default AppWrapper;
