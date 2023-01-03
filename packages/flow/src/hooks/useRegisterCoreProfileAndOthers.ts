import {
  DefaultLogger,
  ILifecycleEventEmitter,
  ILogger,
  IRegistry,
  ManualLifecycleEventEmitter,
  registerCoreProfile,
  registerLifecycleEventEmitter,
  registerLogger,
  Registry
} from '@behave-graph/core';
import { useEffect, useState } from 'react';

export const useRegisterCoreProfileAndOthers = ({
  otherRegisters
}: {
  otherRegisters?: ((registry: Pick<IRegistry, 'nodes' | 'values'>) => void)[];
}) => {
  const [registry, setRegistry] = useState<Registry>();

  const [lifecyleEmitter, setLifecycleEmitter] =
    useState<ILifecycleEventEmitter>(new ManualLifecycleEventEmitter());
  const [logger] = useState<ILogger>(new DefaultLogger());

  useEffect(() => {
    const registry = new Registry();
    const lifecyleEmitter = new ManualLifecycleEventEmitter();
    registerCoreProfile(registry);
    registerLogger(registry.dependencies, logger);
    registerLifecycleEventEmitter(registry.dependencies, lifecyleEmitter);
    otherRegisters?.forEach((register) => {
      register(registry);
    });

    setRegistry(registry);
    setLifecycleEmitter(lifecyleEmitter);
  }, [otherRegisters, logger]);

  return { registry, lifecyleEmitter, logger };
};
