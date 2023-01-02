import { IRegistry, registerCoreProfile, Registry } from '@behave-graph/core';
import { useEffect, useState } from 'react';

export const useRegisterCoreProfileAndOthers = ({
  otherRegisters
}: {
  otherRegisters?: ((registry: Pick<IRegistry, 'nodes' | 'values'>) => void)[];
}) => {
  const [registry, setRegistry] = useState<Registry>();

  useEffect(() => {
    const registry = new Registry();
    registerCoreProfile(registry);
    otherRegisters?.forEach((register) => {
      register(registry);
    });
    setRegistry(registry);
  }, [otherRegisters]);

  return { registry };
};
