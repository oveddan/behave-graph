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
  const valuesTypesMap = useMemo(() => {
    const valueTypes = getCoreValueTypes();

    return toMap(valueTypes);
  }, []);
  const queriableValuesDefinitions = useQueriableDefinitions(valuesTypesMap);

  return queriableValuesDefinitions;
};

export const useCoreNodeDefinitions = ({
  values
}: {
  values: IQuerieableValueTypeRegistry;
}) => {
  const nodeDefinitionsMap = useMemo(() => {
    const coreNodeDefinitions = getCoreNodeDefinitions();
    const stringConversionNodeDefinitions = getStringConversions(values);

    const nodeDefinitions = coreNodeDefinitions.concat(
      stringConversionNodeDefinitions
    );

    return toNodeDefinitionMap(nodeDefinitions);
  }, [values]);

  return useQueriableDefinitions(nodeDefinitionsMap);
};

export const useCoreNodeDefinitionsAndValueTypes = ({
  otherRegisters
}: {
  otherRegisters?: ((registry: IRegistry) => void)[];
}) => {
  const valuesDefinitions = useCoreValueDefinitions();
  const nodeDefinitions = useCoreNodeDefinitions({
    values: valuesDefinitions
  });

  return {
    nodeDefinitions,
    valuesDefinitions
  };
};
