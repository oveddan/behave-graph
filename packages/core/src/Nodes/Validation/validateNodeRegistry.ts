import { createNode, makeGraphApi } from '../../Graphs/Graph';
import { IQuerieableValueTypeRegistry } from '../../Values/ValueTypeRegistry';
import { IQueriableNodeRegistry } from '../Registry/NodeTypeRegistry';

const nodeTypeNameRegex = /^\w+(\/\w+)*$/;
const socketNameRegex = /^\w+$/;

export function validateNodeRegistry({
  nodes,
  values
}: {
  nodes: IQueriableNodeRegistry;
  values: IQuerieableValueTypeRegistry;
}): string[] {
  const errorList: string[] = [];
  // const graph = new Graph(registry);
  const graph = makeGraphApi({
    valuesTypeRegistry: values,
    dependencies: {}
  });
  nodes.getAllNames().forEach((nodeTypeName) => {
    const node = createNode({ graph, nodes, values, nodeTypeName });

    // ensure node is registered correctly.
    if (node.description.typeName !== nodeTypeName) {
      if (!node.description.otherTypeNames?.includes(nodeTypeName)) {
        errorList.push(
          `node with typeName '${node.description.typeName}' is registered under a different name '${nodeTypeName}'`
        );
      }
    }

    if (!nodeTypeNameRegex.test(node.description.typeName)) {
      errorList.push(
        `invalid node type name on node ${node.description.typeName}`
      );
    }

    node.inputs.forEach((socket) => {
      if (!socketNameRegex.test(socket.name)) {
        errorList.push(
          `invalid socket name for input socket ${socket.name} on node ${node.description.typeName}`
        );
      }

      if (socket.valueTypeName === 'flow') {
        return;
      }
      const valueType = values.get(socket.valueTypeName);
      // check to ensure all value types are supported.
      if (valueType === undefined) {
        errorList.push(
          `node '${node.description.typeName}' has on input socket '${socket.name}' an unregistered value type '${socket.valueTypeName}'`
        );
      }
    });

    node.outputs.forEach((socket) => {
      if (!socketNameRegex.test(socket.name)) {
        errorList.push(
          `invalid socket name for output socket ${socket.name} on node ${node.description.typeName}`
        );
      }
      if (socket.valueTypeName === 'flow') {
        return;
      }
      const valueType = values.get(socket.valueTypeName);
      // check to ensure all value types are supported.
      if (valueType === undefined) {
        errorList.push(
          `node '${node.description.typeName}' has on output socket '${socket.name}' an unregistered value type '${socket.valueTypeName}'`
        );
      }
    });
  });
  return errorList;
}
