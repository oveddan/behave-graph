import {
  DefaultLogger,
  Engine,
  Graph,
  GraphJSON,
  ILifecycleEventEmitter,
  ILogger,
  ManualLifecycleEventEmitter,
  NodeSpecJSON,
  readGraphFromJSON,
  registerCoreProfile,
  Registry,
} from 'behave-graph';
import { useCallback, useEffect, useState } from 'react';
import { getNodeSpecJSON } from '../flowEditor/util/getNodeSpecJSON';
import { IScene } from '../abstractions';
import { registerSharedSceneProfiles, registerSpecificSceneProfiles } from './profiles';

export const useRegistry = ({
  scene,
}: {
  scene: IScene | undefined;
}) => {
  const [registry, setRegistry] = useState<Registry>();

  const [lifecyleEmitter, setLifecycleEmitter] = useState<ILifecycleEventEmitter>(new ManualLifecycleEventEmitter());
  const [logger] = useState<ILogger>(new DefaultLogger());

  const [specJson, setSpecJson] = useState<NodeSpecJSON[]>();

  useEffect(() => {
    if (!scene) return;
    const registry = new Registry();
    const lifecyleEmitter = new ManualLifecycleEventEmitter();
    registerCoreProfile(registry, logger, lifecyleEmitter);
    registerSharedSceneProfiles(registry, scene);
    registerSpecificSceneProfiles(registry, scene);
    const specJson = getNodeSpecJSON(registry);

    setRegistry(registry);
    setSpecJson(specJson);
    setLifecycleEmitter(lifecyleEmitter);
  }, [scene, logger]);

  return { registry, specJson, lifecyleEmitter, logger };
};

export const useGraph = (graphJson: GraphJSON | undefined, registry: Registry | undefined) => {
  const [graph, setGraph] = useState<Graph>();

  useEffect(() => {
    if (!graphJson || !registry) {
      setGraph(undefined);
      return;
    }

    setGraph(readGraphFromJSON(graphJson, registry));
  }, [graphJson, registry]);

  return graph;
};

export const useSceneModificationEngine = ({
  graphJson,
  registry,
  eventEmitter,
  autoRun = false
}: {
  graphJson: GraphJSON | undefined;
  registry: Registry | undefined;
  eventEmitter: ILifecycleEventEmitter;
  autoRun?: boolean
}) => {
  const [engine, setEngine] = useState<Engine>();

  const [run, setRun] = useState(autoRun);

  const play = useCallback(() => {
    setRun(true);
  }, []);

  const pause = useCallback(() => {
    setRun(false);
  }, []);

  const togglePlay = useCallback(() => {
    setRun((existing) => !existing);
  }, []);

  useEffect(() => {
    if (!graphJson || !registry || !run) return;

    const graph = readGraphFromJSON(graphJson, registry);
    const engine = new Engine(graph);

    setEngine(engine);

    return () => {
      engine.dispose();
      setEngine(undefined);
    };
  }, [graphJson, registry, run]);

  useEffect(() => {
    if (!engine || !run) return;

    engine.executeAllSync();

    let timeout: number;

    const onTick = async () => {
      eventEmitter.tickEvent.emit();

      // eslint-disable-next-line no-await-in-loop
      await engine.executeAllAsync(500);

      timeout = window.setTimeout(onTick, 50);
    };

    (async () => {
      if (eventEmitter.startEvent.listenerCount > 0) {
        eventEmitter.startEvent.emit();

        await engine.executeAllAsync(5);
      } else {
        console.log('has no listener count');
      }
      onTick();
    })();

    return () => {
      console.log('clear timeout');
      window.clearTimeout(timeout);
    };
  }, [eventEmitter, engine, run]);

  return {
    engine,
    playing: run,
    play,
    togglePlay,
    pause
  };
};
