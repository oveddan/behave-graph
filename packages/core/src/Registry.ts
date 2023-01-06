import { NodeTypeRegistry } from './Nodes/Registry/NodeTypeRegistry';
import { ValueTypeRegistry } from './Values/ValueTypeRegistry';

export interface IRegistry {
  readonly values: ValueTypeRegistry;
  readonly nodes: NodeTypeRegistry;
}

export const createRegistry: () => IRegistry = () => ({
  values: new ValueTypeRegistry(),
  nodes: new NodeTypeRegistry()
});
