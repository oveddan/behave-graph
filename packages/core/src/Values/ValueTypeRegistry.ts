import { ValueType } from './ValueType';

export type ValueTypeMap = { [key: string]: ValueType };

export interface IQueriableRegistry<T> {
  contains(name: string): boolean;
  get(name: string): T;
  getAllNames(): string[];
  getAll(): T[];
}

export type IQuerieableValueTypeRegistry = IQueriableRegistry<ValueType>;

export class ValueTypeRegistry implements IQuerieableValueTypeRegistry {
  private readonly valueTypeNameToValueType: ValueTypeMap = {};

  register(...valueTypes: Array<ValueType>) {
    valueTypes.forEach((valueType) => {
      if (valueType.name in this.valueTypeNameToValueType) {
        throw new Error(`already registered value type ${valueType.name}`);
      }
      this.valueTypeNameToValueType[valueType.name] = valueType;
    });
  }

  contains(typeName: string): boolean {
    throw new Error('no implmentation for contains (yet)');
  }

  get(valueTypeName: string): ValueType {
    if (!(valueTypeName in this.valueTypeNameToValueType)) {
      throw new Error(`can not find value type with name '${valueTypeName}`);
    }
    return this.valueTypeNameToValueType[valueTypeName];
  }

  getAllNames(): string[] {
    return Object.keys(this.valueTypeNameToValueType);
  }

  getAll(): ValueType[] {
    return Object.values(this.valueTypeNameToValueType);
  }
}
