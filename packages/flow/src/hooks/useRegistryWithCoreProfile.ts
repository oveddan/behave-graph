import {
  createRegistry,
  getCoreNodeDefinitions,
  getCoreValueTypes,
  getStringConversions,
  IQuerieableValueTypeRegistry,
  IRegistry,
  registerCoreNodes,
  registerCoreValueTypes,
  registerSerializers,
  toMap,
  toNodeDefinitionMap
} from '@behave-graph/core';
import { useMemo } from 'react';

import { useQueriableDefinitions } from './useQueriableDefinitions';

const createRegistryWithCoreProfile = () => {
  const { nodes, values } = createRegistry();
  registerCoreValueTypes(values);
  registerCoreNodes(nodes);
  registerSerializers({ nodes, values });

  return { nodes, values };
};

export const useCoreValueDefinitions = () => {
  const coreValueTypes = useMemo(() => getCoreValueTypes(), []);
  const valueTypes = coreValueTypes;
  const valuesTypesMap = useMemo(() => toMap(valueTypes), [valueTypes]);
  const queriableValuesDefinitions = useQueriableDefinitions(valuesTypesMap);

  return queriableValuesDefinitions;
};

export const useCoreNodeDefinitions = ({
  values
}: {
  values: IQuerieableValueTypeRegistry;
}) => {
  const coreNodeDefinitions = useMemo(() => getCoreNodeDefinitions(), []);
  const stringConversionNodeDefinitions = useMemo(
    () => getStringConversions(values),
    [values]
  );

  const nodeDefinitions = useMemo(
    () => coreNodeDefinitions.concat(stringConversionNodeDefinitions),
    [coreNodeDefinitions, stringConversionNodeDefinitions]
  );
  const nodeDefinitionMap = useMemo(
    () => toNodeDefinitionMap(nodeDefinitions),
    [nodeDefinitions]
  );

  return useQueriableDefinitions(nodeDefinitionMap);
};

export const useCoreNodeDefinitionsAndValueTypes = ({
  otherRegisters
}: {
  otherRegisters?: ((registry: IRegistry) => void)[];
}) => {
  const queriableValuesDefinitions = useCoreValueDefinitions();
  const nodeDefinitions = useCoreNodeDefinitions({
    values: queriableValuesDefinitions
  });

  return {
    nodeDefinitions,
    valuesDefinitions: queriableValuesDefinitions
  };
};
