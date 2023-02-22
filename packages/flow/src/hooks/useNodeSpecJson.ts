import {
  Dependencies,
  IQueriableNodeRegistry,
  IQuerieableValueTypeRegistry,
  NodeSpecJSON,
  writeNodeSpecsToJSON
} from '@behave-graph/core';
import { useEffect, useState } from 'react';

export const useNodeSpecJson = ({
  values,
  nodes,
  dependencies
}: {
  values: IQuerieableValueTypeRegistry | undefined;
  nodes: IQueriableNodeRegistry | undefined;
  dependencies: Dependencies | undefined;
}) => {
  const [specJson, setSpecJson] = useState<NodeSpecJSON[]>();

  useEffect(() => {
    if (!nodes || !values || !dependencies) {
      setSpecJson(undefined);
      return;
    }
    setSpecJson(writeNodeSpecsToJSON({ nodes, values, dependencies }));
  }, [nodes, values, dependencies]);

  return specJson;
};
