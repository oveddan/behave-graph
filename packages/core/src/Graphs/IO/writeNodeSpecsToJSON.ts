import { NodeCategory } from '../../Nodes/NodeDefinitions';
import { Registry } from '../../Registry';
import { createNode, IGraphApi } from '../Graph';
import {
  InputSocketSpecJSON,
  NodeSpecJSON,
  OutputSocketSpecJSON
} from './NodeSpecJSON';

export function writeNodeSpecsToJSON(registry: Registry): NodeSpecJSON[] {
  const nodeSpecsJSON: NodeSpecJSON[] = [];

  // const graph = new Graph(registry);

  const graph: IGraphApi = {
    values: registry.values,
    customEvents: {},
    getDependency: (id: string) => registry.dependencies.get(id),
    variables: {}
  };

  registry.nodes.getAllNames().forEach((nodeTypeName) => {
    const node = createNode({ graph, registry, nodeTypeName });

    const nodeSpecJSON: NodeSpecJSON = {
      type: nodeTypeName,
      category: node.description.category as NodeCategory,
      label: node.description.label,
      inputs: [],
      outputs: [],
      configuration: []
    };

    node.inputs.forEach((inputSocket) => {
      const valueType =
        inputSocket.valueTypeName === 'flow'
          ? undefined
          : registry.values.get(inputSocket.valueTypeName);

      let defaultValue = inputSocket.value;
      if (valueType !== undefined) {
        defaultValue = valueType.serialize(defaultValue);
      }
      if (defaultValue === undefined && valueType !== undefined) {
        defaultValue = valueType.serialize(valueType.creator());
      }
      const socketSpecJSON: InputSocketSpecJSON = {
        name: inputSocket.name,
        valueType: inputSocket.valueTypeName,
        defaultValue
      };
      nodeSpecJSON.inputs.push(socketSpecJSON);
    });

    node.outputs.forEach((outputSocket) => {
      const socketSpecJSON: OutputSocketSpecJSON = {
        name: outputSocket.name,
        valueType: outputSocket.valueTypeName
      };
      nodeSpecJSON.outputs.push(socketSpecJSON);
    });

    nodeSpecsJSON.push(nodeSpecJSON);
  });

  return nodeSpecsJSON;
}
