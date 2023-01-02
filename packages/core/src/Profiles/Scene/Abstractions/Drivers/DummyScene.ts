import { BooleanValue } from '@/Profiles/Core/Values/BooleanValue';
import { FloatValue } from '@/Profiles/Core/Values/FloatValue';
import { IntegerValue } from '@/Profiles/Core/Values/IntegerValue';
import { StringValue } from '@/Profiles/Core/Values/StringValue';
import { EventEmitter } from '@/Events/EventEmitter';
import { ValueTypeRegistry } from '@/Values/ValueTypeRegistry';

import { ColorValue } from '../../Values/ColorValue';
import { EulerValue } from '../../Values/EulerValue';
import { QuatValue } from '../../Values/QuatValue';
import { Vec2Value } from '../../Values/Vec2Value';
import { Vec3Value } from '../../Values/Vec3Value';
import { Vec4Value } from '../../Values/Vec4Value';
import { IScene } from '../IScene';

export class DummyScene implements IScene {
  public onSceneChanged = new EventEmitter<void>();
  private valueRegistry = new ValueTypeRegistry();

  constructor() {
    const values = this.valueRegistry;
    // pull in value type nodes
    values.register(BooleanValue);
    values.register(StringValue);
    values.register(IntegerValue);
    values.register(FloatValue);
    values.register(Vec2Value);
    values.register(Vec3Value);
    values.register(Vec4Value);
    values.register(ColorValue);
    values.register(EulerValue);
    values.register(QuatValue);
  }

  getProperty(jsonPath: string, valueTypeName: string): any {
    return this.valueRegistry.get(valueTypeName).creator();
  }
  setProperty(): void {
    this.onSceneChanged.emit();
  }
  addOnClickedListener(
    jsonPath: string,
    callback: (jsonPath: string) => void
  ): void {
    throw new Error('Method not implemented.');
  }
}
