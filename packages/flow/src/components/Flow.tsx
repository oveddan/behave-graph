import { FC, MouseEvent as ReactMouseEvent, useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  OnConnectStartParams,
  XYPosition,
} from "reactflow";
import { GraphJSON } from "@behave-graph/core";
import { customNodeTypes } from "../util/customNodeTypes";
import CustomControls from "./Controls";
import NodePicker from "./NodePicker";
import { getNodePickerFilters } from "../util/getPickerFilters";
import { useRegisterCoreProfileAndOthers } from "../hooks/useRegisterCoreProfileAndOthers";
import { useNodeSpecJson } from "../hooks/useNodeSpecJson";
import { useBehaveGraphFlow } from "../hooks/useBehaveGraphFlow";
import useEngine from "../hooks/useEngine";
import { useFlowHandlers } from "../hooks/useFlowHandlers";

type FlowProps = {
  graph: GraphJSON
}

export const Flow: FC<FlowProps> = ({ graph }) => {
  const { registry, lifecyleEmitter } = useRegisterCoreProfileAndOthers({});

  const specJson = useNodeSpecJson(registry);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    graphJson,
    setGraphJson
  } = useBehaveGraphFlow({
    initialGraphJsonUrl: initialBehaviorGraphUrl,
    specJson
  });

  const { onConnect, handleStartConnect, handleStopConnect, handlePaneClick, handlePaneContextMenu, nodePickerVisibility, handleAddNode, lastConnectStart, closeNodePicker } = useFlowHandlers({
    nodes,
    onEdgesChange,
    onNodesChange
  })

  const { togglePlay, playing } = useEngine({
    graphJson,
    registry,
    eventEmitter: lifecyleEmitter
  });

  return (
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
      <CustomControls playing={playing} togglePlay={togglePlay} setBehaviorGraph={setGraphJson} />
      <Background
        variant={BackgroundVariant.Lines}
        color="#2a2b2d"
        style={{ backgroundColor: "#1E1F22" }}
      />
      {nodePickerVisibility && (
        <NodePicker
          position={nodePickerVisibility}
          filters={getNodePickerFilters(nodes, lastConnectStart)}
          onPickNode={handleAddNode}
          onClose={closeNodePicker}
        />
      )}
    </ReactFlow>
  );
}
