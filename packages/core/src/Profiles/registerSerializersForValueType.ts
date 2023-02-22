import { makeInNOutFunctionDesc } from '../Nodes/FunctionNode';
import { toCamelCase } from '../toCamelCase';
import { IQuerieableValueTypeRegistry } from '../Values/ValueTypeRegistry';

export function getStringConversionsForValueType({
  values,
  valueTypeName
}: {
  values: Pick<IQuerieableValueTypeRegistry, 'get'>;
  valueTypeName: string;
}) {
  const camelCaseValueTypeName = toCamelCase(valueTypeName);
  return [
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
  ];
}
