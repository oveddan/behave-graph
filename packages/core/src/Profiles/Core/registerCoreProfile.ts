/* eslint-disable max-len */

import { getNodeDescriptions } from '../../Nodes/Registry/NodeDescription';
import {
  NodeDefinition,
  NodeTypeRegistry
} from '../../Nodes/Registry/NodeTypeRegistry';
import { IRegistry } from '../../Registry';
import { ValueType } from '../../Values/ValueType';
import {
  IQuerieableValueTypeRegistry,
  ValueTypeRegistry
} from '../../Values/ValueTypeRegistry';
import { getStringConversionsForValueType } from '../registerSerializersForValueType';
import { ILifecycleEventEmitter } from './Abstractions/ILifecycleEventEmitter';
import { ILogger } from './Abstractions/ILogger';
import { OnCustomEvent } from './CustomEvents/OnCustomEvent';
import { TriggerCustomEvent } from './CustomEvents/TriggerCustomEvent';
import { ExpectTrue as AssertExpectTrue } from './Debug/AssertExpectTrue';
import { Log as DebugLog, loggerDependencyKey } from './Debug/DebugLog';
import { Branch } from './Flow/Branch';
import { Counter } from './Flow/Counter';
import { Debounce } from './Flow/Debounce';
import { DoN } from './Flow/DoN';
import { DoOnce } from './Flow/DoOnce';
import { FlipFlop } from './Flow/FlipFlop';
import { ForLoop } from './Flow/ForLoop';
import { Gate } from './Flow/Gate';
import { MultiGate } from './Flow/MultieGate';
import { Sequence } from './Flow/Sequence';
import { SwitchOnInteger } from './Flow/SwitchOnInteger';
import { SwitchOnString } from './Flow/SwitchOnString';
import { Throttle } from './Flow/Throttle';
import { WaitAll } from './Flow/WaitAll';
import { LifecycleOnEnd } from './Lifecycle/LifecycleOnEnd';
import {
  lifecycleEventEmitterDependencyKey,
  LifecycleOnStart
} from './Lifecycle/LifecycleOnStart';
import { LifecycleOnTick } from './Lifecycle/LifecycleOnTick';
import { Easing } from './Logic/Easing';
import { Delay } from './Time/Delay';
import * as TimeNodes from './Time/TimeNodes';
import * as BooleanNodes from './Values/BooleanNodes';
import { BooleanValue } from './Values/BooleanValue';
import * as FloatNodes from './Values/FloatNodes';
import { FloatValue } from './Values/FloatValue';
import * as IntegerNodes from './Values/IntegerNodes';
import { IntegerValue } from './Values/IntegerValue';
import * as StringNodes from './Values/StringNodes';
import { StringValue } from './Values/StringValue';
import { VariableGet } from './Variables/VariableGet';
import { VariableSet } from './Variables/VariableSet';

export const makeCoreDependencies = ({
  lifecyleEmitter,
  logger
}: {
  lifecyleEmitter: ILifecycleEventEmitter;
  logger: ILogger;
}) => ({
  [lifecycleEventEmitterDependencyKey]: lifecyleEmitter,
  [loggerDependencyKey]: logger
});

export function getCoreValueTypes(): Array<ValueType<any, any>> {
  return [BooleanValue, StringValue, IntegerValue, FloatValue];
}

export function toMap<T extends { name: string }>(
  elements: T[]
): { [key: string]: T } {
  return Object.fromEntries(elements.map((element) => [element.name, element]));
}

export function registerCoreValueTypes(values: ValueTypeRegistry) {
  // pull in value type nodes
  values.register(...getCoreValueTypes());
}

export function getCoreNodeDefinitions(): NodeDefinition[] {
  return [
    ...getNodeDescriptions(StringNodes),
    ...getNodeDescriptions(BooleanNodes),
    ...getNodeDescriptions(IntegerNodes),
    ...getNodeDescriptions(FloatNodes),

    // custom events

    OnCustomEvent.Description,
    TriggerCustomEvent.Description,

    // variables

    VariableGet,
    VariableSet,

    // complex logic

    Easing,

    // actions

    DebugLog,
    AssertExpectTrue.Description,

    // events

    LifecycleOnStart,
    LifecycleOnEnd,
    LifecycleOnTick,

    // time

    Delay.Description,
    ...getNodeDescriptions(TimeNodes),

    // flow control

    Branch,
    FlipFlop,
    ForLoop,
    Sequence,
    SwitchOnInteger,
    SwitchOnString,
    Debounce.Description,
    Throttle.Description,
    DoN,
    DoOnce,
    Gate,
    MultiGate,
    WaitAll.Description,
    Counter
  ];
}

export function registerCoreNodes(nodes: NodeTypeRegistry) {
  // pull in value type nodes
  nodes.register(...getCoreNodeDefinitions());
}

export function getStringConversions(
  values: IQuerieableValueTypeRegistry
): NodeDefinition[] {
  return ['boolean', 'float', 'integer'].flatMap((valueTypeName) =>
    getStringConversionsForValueType({ values, valueTypeName })
  );
}

export function registerSerializers({
  values,
  nodes
}: {
  nodes: NodeTypeRegistry;
  values: IQuerieableValueTypeRegistry;
}) {
  // string converters
  ['boolean', 'float', 'integer'].forEach((valueTypeName) => {
    nodes.register(
      ...getStringConversionsForValueType({ values, valueTypeName })
    );
  });
}

export function registerCoreProfile({
  nodes,
  values
}: Pick<IRegistry, 'values' | 'nodes'>) {
  registerCoreValueTypes(values);
  registerCoreNodes(nodes);
  registerSerializers({ nodes, values });
}
