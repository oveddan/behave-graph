import { GraphJSON, NodeSpecJSON } from '@behave-graph/core';
import { useCallback, useEffect, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';

// import { examplePairs } from '../components/LoadModal';
import { behaveToFlow } from '../transformers/behaveToFlow';
import { flowToBehave } from '../transformers/flowToBehave';
import { autoLayout } from '../util/autoLayout';
import { hasPositionMetaData } from '../util/hasPositionMetaData';

const useBehaveGraphFlow = (specJson: NodeSpecJSON[] | undefined) => {
  const [graphJson, setStoredGraphJson] = useState<GraphJSON>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const setGraphJson = useCallback((graphJson: GraphJSON) => {
    if (!graphJson) return;

    const [nodes, edges] = behaveToFlow(graphJson);

    if (hasPositionMetaData(graphJson) === false) {
      autoLayout(nodes, edges);
    }

    setNodes(nodes);
    setEdges(edges);
    setStoredGraphJson(graphJson);
  }, []);

  useEffect(() => {
    if (!specJson) return;
    // when nodes and edges are updated, update the graph json with the flow to behave behavior
    const graphJson = flowToBehave({ nodes, edges, nodeSpecJSON: specJson });
    setStoredGraphJson(graphJson);
  }, [nodes, edges, specJson]);

  return {
    nodes,
    edges,
    onEdgesChange,
    onNodesChange,
    setGraphJson,
    graphJson
  };
};

export default useBehaveGraphFlow;
