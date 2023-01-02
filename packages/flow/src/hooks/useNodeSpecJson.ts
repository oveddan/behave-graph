import {
  Dependencies,
  NodeSpecJSON,
  Registry,
  writeNodeSpecsToJSON
} from '@behave-graph/core';
import { useEffect, useState } from 'react';

export const useNodeSpecJson = ({
  registry,
  dependencies
}: {
  registry: Registry | undefined;
  dependencies: Dependencies | undefined;
}) => {
  const [specJson, setSpecJson] = useState<NodeSpecJSON[]>();

  useEffect(() => {
    if (!registry || !dependencies) return;
    const specJson = writeNodeSpecsToJSON(registry, dependencies);
    setSpecJson(specJson);
  }, [registry, dependencies]);

  return specJson;
};
