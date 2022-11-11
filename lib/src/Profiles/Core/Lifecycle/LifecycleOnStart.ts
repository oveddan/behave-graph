import { Assert } from '../../../Diagnostics/Assert.js';
import { Engine } from '../../../Graphs/Execution/Engine.js';
import { Graph } from '../../../Graphs/Graph.js';
import { EventNode } from '../../../Nodes/EventNode.js';
import { NodeDescription } from '../../../Nodes/Registry/NodeDescription.js';
import { Socket } from '../../../Sockets/Socket.js';
import { ILifecycleEventEmitter } from '../Abstractions/ILifecycleEventEmitter.js';

// inspired by: https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/Blueprints/UserGuide/Events/
export class LifecycleOnStart extends EventNode {
  public static Description = new NodeDescription(
    'lifecycle/onStart',
    'Event',
    'On Start',
    (description, graph) => new LifecycleOnStart(description, graph)
  );

  constructor(description: NodeDescription, graph: Graph) {
    super(description, graph, [], [new Socket('flow', 'flow')]);
  }

  private onStartEvent: (() => void) | undefined = undefined;

  init(engine: Engine) {
    Assert.mustBeTrue(this.onStartEvent === undefined);
    this.onStartEvent = () => {
      engine.commitToNewFiber(this, 'flow');
    };

    const lifecycleEvents =
      engine.graph.registry.abstractions.get<ILifecycleEventEmitter>(
        'ILifecycleEventEmitter'
      );
    lifecycleEvents.startEvent.addListener(this.onStartEvent);
  }

  dispose(engine: Engine) {
    Assert.mustBeTrue(this.onStartEvent !== undefined);
    if (this.onStartEvent !== undefined) {
      const lifecycleEvents =
        engine.graph.registry.abstractions.get<ILifecycleEventEmitter>(
          'ILifecycleEventEmitter'
        );
      lifecycleEvents.startEvent.removeListener(this.onStartEvent);
    }
  }
}
