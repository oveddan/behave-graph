import {
  createRegistry,
  IRegistry,
  registerCoreNodes,
  registerCoreValueTypes,
  registerSerializers
} from '@behave-graph/core';
import { useEffect, useState } from 'react';

const createRegistryWithCoreProfile = () => {
  const { nodes, values } = createRegistry();
  registerCoreValueTypes(values);
  registerCoreNodes(nodes);
  registerSerializers({ nodes, values });

  return { nodes, values };
};

export const useRegistryWithCoreProfile = ({
  otherRegisters
}: {
  otherRegisters?: ((registry: IRegistry) => void)[];
}) => {
  const [registry, setRegistry] = useState<IRegistry>();

  useEffect(() => {
    const { nodes, values } = createRegistryWithCoreProfile();

    otherRegisters?.forEach((register) => {
      register({ nodes, values });
    });
    setRegistry({ nodes, values });
  }, [otherRegisters]);

  return registry;
};
