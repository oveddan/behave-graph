import { GraphJSON, NodeSpecJSON } from '@behave-graph/core';
import { useCallback, useEffect, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';

import { behaveToFlow } from '../transformers/behaveToFlow';
import { flowToBehave } from '../transformers/flowToBehave';
import { autoLayout } from '../util/autoLayout';
import { hasPositionMetaData } from '../util/hasPositionMetaData';

export const fetchBehaviorGraphJson = async (url: string) =>
  // eslint-disable-next-line unicorn/no-await-expression-member
  (await (await fetch(url)).json()) as GraphJSON;

/**
 * Hook that returns the nodes and edges for react-flow, and the graphJson for the behave-graph.
 * If nodes or edges are changes, the graph json is updated automatically.
 * The graph json can be set manually, in which case the nodes and edges are updated to match the graph json.
 * @param param0
 * @returns
 */
export const useBehaveGraphFlow = ({
  initialGraphJson,
  specJson
}: {
  initialGraphJson: GraphJSON;
  specJson: NodeSpecJSON[] | undefined;
}) => {
  const [graphJson, setStoredGraphJson] = useState<GraphJSON | undefined>(
    initialGraphJson
  );
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
    const graphJson = flowToBehave(nodes, edges);
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
