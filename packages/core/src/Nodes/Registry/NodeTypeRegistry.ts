import { IQueriableRegistry } from '../../Values/ValueTypeRegistry';
import { IHasNodeFactory, INodeDefinition } from '../NodeDefinitions';

export type NodeDefinition = IHasNodeFactory &
  Pick<INodeDefinition, 'typeName' | 'otherTypeNames'>;

export type IQueriableNodeRegistry = IQueriableRegistry<NodeDefinition>;

export type NodeDefinitionsMap = {
  [type: string]: NodeDefinition;
};

export const toNodeDefinitionMap = (
  descriptions: Array<NodeDefinition>
): NodeDefinitionsMap => {
  const nodeDefinitionMap: NodeDefinitionsMap = {};

  descriptions.forEach((description) => {
    const allTypeNames = (description.otherTypeNames || []).concat([
      description.typeName
    ]);

    allTypeNames.forEach((typeName) => {
      if (typeName in nodeDefinitionMap) {
        throw new Error(`already registered node type ${typeName} (string)`);
      }
      nodeDefinitionMap[typeName] = description;
    });
  });

  return nodeDefinitionMap;
};

// Deprecated: use IQueriableRegistry<NodeDefinition> instead
export class NodeTypeRegistry implements IQueriableNodeRegistry {
  private typeNameToNodeDescriptions: {
    [type: string]: NodeDefinition;
  } = {};

  clear() {
    for (const nodeTypeName in this.typeNameToNodeDescriptions) {
      delete this.typeNameToNodeDescriptions[nodeTypeName];
    }
  }
  register(...descriptions: Array<NodeDefinition>) {
    this.typeNameToNodeDescriptions = {
      ...this.typeNameToNodeDescriptions,
      ...toNodeDefinitionMap(descriptions)
    };
  }

  contains(typeName: string): boolean {
    return typeName in this.typeNameToNodeDescriptions;
  }
  get(typeName: string): NodeDefinition {
    if (!(typeName in this.typeNameToNodeDescriptions)) {
      throw new Error(`no registered node with type name ${typeName}`);
    }
    return this.typeNameToNodeDescriptions[typeName];
  }

  getAllNames(): string[] {
    return Object.keys(this.typeNameToNodeDescriptions);
  }

  getAll(): NodeDefinition[] {
    return Object.values(this.typeNameToNodeDescriptions);
  }
}
