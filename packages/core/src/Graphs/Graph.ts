import { CustomEvent } from '../Events/CustomEvent';
import { generateUuid } from '../generateUuid';
import { Metadata } from '../Metadata';
import { NodeConfiguration } from '../Nodes/Node';
import { INode } from '../Nodes/NodeInstance';
import { Dependencies } from '../Nodes/Registry/DependenciesRegistry';
import { IRegistry, Registry } from '../Registry';
import { Socket } from '../Sockets/Socket';
import { Variable } from '../Variables/Variable';
// Purpose:
//  - stores the node graph

export interface IGraphApi {
  readonly variables: { [id: string]: Variable };
  readonly customEvents: { [id: string]: CustomEvent };
  readonly values: Registry['values'];
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
  registry,
  nodeTypeName,
  nodeId = generateUuid(),
  nodeConfiguration = {}
}: {
  graph: IGraphApi;
  registry: Pick<IRegistry, 'nodes' | 'values'>;
  nodeTypeName: string;
  nodeId?: string;
  nodeConfiguration?: NodeConfiguration;
}) => {
  let nodeDefinition = undefined;
  if (registry.nodes.contains(nodeTypeName)) {
    nodeDefinition = registry.nodes.get(nodeTypeName);
  }
  if (nodeDefinition === undefined) {
    throw new Error(
      `no registered node descriptions with the typeName ${nodeTypeName}`
    );
  }

  const node = nodeDefinition.nodeFactory(graph, nodeConfiguration);

  node.id = nodeId;

  node.inputs.forEach((socket: Socket) => {
    if (socket.valueTypeName !== 'flow' && socket.value === undefined) {
      socket.value = registry.values.get(socket.valueTypeName).creator();
    }
  });

  return node;
};

export const makeGraphApi = ({
  variables = {},
  customEvents = {},
  registry: { values: valuesRegistry },
  dependencies = {}
}: {
  customEvents?: GraphCustomEvents;
  variables?: GraphVariables;
  registry: Pick<IRegistry, 'values'>;
  dependencies: Dependencies;
}): IGraphApi => ({
  variables,
  customEvents,
  values: valuesRegistry,
  getDependency: (id: string) => dependencies[id]
});
