import { MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';
import { Connection, Node, OnConnectStartParams, XYPosition } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import { calculateNewEdge } from '../util/calculateNewEdge';
import { useBehaveGraphFlow } from './useBehaveGraphFlow';

type BehaveGraphFlow = ReturnType<typeof useBehaveGraphFlow>;

export const useFlowHandlers = ({
  onEdgesChange,
  onNodesChange,
  nodes
}: Pick<BehaveGraphFlow, 'onEdgesChange' | 'onNodesChange'> & {
  nodes: Node[];
}) => {
  const [lastConnectStart, setLastConnectStart] =
    useState<OnConnectStartParams>();
  const [nodePickerVisibility, setNodePickerVisibility] =
    useState<XYPosition>();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === null) return;
      if (connection.target === null) return;

      const newEdge = {
        id: uuidv4(),
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle
      };
      onEdgesChange([
        {
          type: 'add',
          item: newEdge
        }
      ]);
    },
    [onEdgesChange]
  );

  const handleAddNode = useCallback(
    (nodeType: string, position: XYPosition) => {
      closeNodePicker();
      const newNode = {
        id: uuidv4(),
        type: nodeType,
        position,
        data: {}
      };
      onNodesChange([
        {
          type: 'add',
          item: newNode
        }
      ]);

      if (lastConnectStart === undefined) return;

      // add an edge if we started on a socket
      const originNode = nodes.find(
        (node) => node.id === lastConnectStart.nodeId
      );
      if (originNode === undefined) return;
      onEdgesChange([
        {
          type: 'add',
          item: calculateNewEdge(
            originNode,
            nodeType,
            newNode.id,
            lastConnectStart
          )
        }
      ]);
    },
    [lastConnectStart, nodes, onEdgesChange, onNodesChange]
  );

  const handleStartConnect = (
    e: ReactMouseEvent,
    params: OnConnectStartParams
  ) => {
    setLastConnectStart(params);
  };

  const handleStopConnect = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    if (element.classList.contains('react-flow__pane')) {
      setNodePickerVisibility({ x: e.clientX, y: e.clientY });
    } else {
      setLastConnectStart(undefined);
    }
  };

  const closeNodePicker = () => {
    setLastConnectStart(undefined);
    setNodePickerVisibility(undefined);
  };

  const handlePaneClick = () => closeNodePicker();

  const handlePaneContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setNodePickerVisibility({ x: e.clientX, y: e.clientY });
  };

  return {
    onConnect,
    handleStartConnect,
    handleStopConnect,
    handlePaneClick,
    handlePaneContextMenu,
    lastConnectStart,
    nodePickerVisibility,
    handleAddNode,
    closeNodePicker
  };
};
