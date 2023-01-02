import { NodeTypeRegistry } from './Nodes/Registry/NodeTypeRegistry';
import { ValueTypeRegistry } from './Values/ValueTypeRegistry';

export interface IRegistry {
  readonly values: ValueTypeRegistry;
  readonly nodes: NodeTypeRegistry;
}

export class Registry implements IRegistry {
  public readonly values = new ValueTypeRegistry();
  public readonly nodes = new NodeTypeRegistry();
}
