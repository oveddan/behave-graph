import { makeInNOutFunctionDesc } from '../Nodes/FunctionNode';
import { NodeTypeRegistry } from '../Nodes/Registry/NodeTypeRegistry';
import { toCamelCase } from '../toCamelCase';
import { ValueTypeRegistry } from '../Values/ValueTypeRegistry';

export function registerStringConversionsForValueType({
  nodes,
  values,
  valueTypeName
}: {
  nodes: NodeTypeRegistry;
  values: ValueTypeRegistry;
  valueTypeName: string;
}) {
  const camelCaseValueTypeName = toCamelCase(valueTypeName);
  nodes.register(
    makeInNOutFunctionDesc({
      name: `math/to${camelCaseValueTypeName}/string`,
      label: `To ${camelCaseValueTypeName}`,
      in: ['string'],
      out: valueTypeName,
      exec: (a: string) => values.get(valueTypeName).deserialize(a)
    }),
    makeInNOutFunctionDesc({
      name: `math/toString/${valueTypeName}`,
      label: 'To String',
      in: [valueTypeName],
      out: 'string',
      exec: (a: any) => values.get(valueTypeName).serialize(a)
    })
  );
}
