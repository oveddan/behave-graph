import {
  Dependencies,
  Engine,
  GraphJSON,
  GraphNodes,
  ILifecycleEventEmitter,
  IQuerieableValueTypeRegistry,
  readGraphFromJSON
} from '@behave-graph/core';
import { useCallback, useEffect, useState } from 'react';

/** Runs the behavior graph by building the execution
 * engine and triggering start on the lifecycle event emitter.
 */
export const useGraphRunner = ({
  graphJson,
  eventEmitter,
  autoRun = false,
  valuesTypeRegistry,
  dependencies
}: {
  graphJson: GraphJSON | undefined;
  eventEmitter: ILifecycleEventEmitter;
  autoRun?: boolean;
  valuesTypeRegistry: IQuerieableValueTypeRegistry;
  dependencies: Dependencies | undefined;
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
    if (!graphJson || !valuesTypeRegistry || !run || !dependencies) return;

    let graphNodes: GraphNodes;
    try {
      graphNodes = readGraphFromJSON({
        graphJson,
        values: valuesTypeRegistry,
        dependencies
      }).nodes;
    } catch (e) {
      console.error(e);
      return;
    }
    const engine = new Engine(graphNodes);

    setEngine(engine);

    return () => {
      engine.dispose();
      setEngine(undefined);
    };
  }, [graphJson, valuesTypeRegistry, run, dependencies]);

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
      window.clearTimeout(timeout);
    };
  }, [engine, eventEmitter.startEvent, eventEmitter.tickEvent, run]);

  return {
    engine,
    playing: run,
    play,
    togglePlay,
    pause
  };
};