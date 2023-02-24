import { CustomEvent } from '../Events/CustomEvent';
import { Metadata } from '../Metadata';
import { NodeConfiguration } from '../Nodes/Node';
import { INode } from '../Nodes/NodeInstance';
import { Dependencies } from '../Nodes/Registry/DependenciesRegistry';
import { IQueriableNodeRegistry } from '../Nodes/Registry/NodeTypeRegistry';
import { Socket } from '../Sockets/Socket';
import { IQuerieableValueTypeRegistry } from '../Values/ValueTypeRegistry';
import { Variable } from '../Variables/Variable';
// Purpose:
//  - stores the node graph

export interface IGraphApi {
  readonly variables: { [id: string]: Variable };
  readonly customEvents: { [id: string]: CustomEvent };
  readonly values: Pick<IQuerieableValueTypeRegistry, 'get'>;
  readonly getDependency: <T>(id: string) => T;
}

export type GraphNodes = { [id: string]: INode };
export type GraphVariables = { [id: string]: Variable };
export type GraphCustomEvents = { [id: string]: CustomEvent };

export type GraphInstance = {
  name: string;
  metadata: Metadata;
  nodes: GraphNodes;
  customEvents: GraphCustomEvents;
  variables: GraphVariables;
};

export const createNode = ({
  graph,
  nodes,
  values,
  nodeTypeName,
  nodeConfiguration = {}
}: {
  graph: IGraphApi;
  nodes: Pick<IQueriableNodeRegistry, 'get' | 'contains'>;
  values: Pick<IQuerieableValueTypeRegistry, 'get'>;
  nodeTypeName: string;
  nodeConfiguration?: NodeConfiguration;
}) => {
  let nodeDefinition = undefined;
  if (nodes.contains(nodeTypeName)) {
    nodeDefinition = nodes.get(nodeTypeName);
  }
  if (nodeDefinition === undefined) {
    throw new Error(
      `no registered node descriptions with the typeName ${nodeTypeName}`
    );
  }

  const node = nodeDefinition.nodeFactory(graph, nodeConfiguration);

  node.inputs.forEach((socket: Socket) => {
    if (socket.valueTypeName !== 'flow' && socket.value === undefined) {
      socket.value = values.get(socket.valueTypeName).creator();
    }
  });

  return node;
};

export const makeGraphApi = ({
  variables = {},
  customEvents = {},
  valuesTypeRegistry,
  dependencies = {}
}: {
  customEvents?: GraphCustomEvents;
  variables?: GraphVariables;
  valuesTypeRegistry: Pick<IQuerieableValueTypeRegistry, 'get'>;
  dependencies: Dependencies;
}): IGraphApi => ({
  variables,
  customEvents,
  values: valuesTypeRegistry,
  getDependency: (id: string) => dependencies[id]
});
