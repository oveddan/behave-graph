import { NodeSpecJSON, Registry } from "behave-graph";
import { useEffect, useState } from "react";
import { getNodeSpecJSON } from "../flowEditor/util/getNodeSpecJSON";

const useNodeSpecJson = (registry: Registry|undefined) => {
  const [specJson, setSpecJson] = useState<NodeSpecJSON[]>();

  useEffect(() => {
    if (!registry) return;
    setSpecJson(getNodeSpecJSON(registry));
  }, [registry]);


  return specJson;
}

export default useNodeSpecJson;