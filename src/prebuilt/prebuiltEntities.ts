import { Entity } from './../Entity';

export class ResolvablePrebuiltEntity implements Entity {
    public readonly type: string;
    public readonly entity: string;
    public readonly startIndex: number;
    public readonly endIndex: number;
    public resolution: ValueResolution | MultipleValueResolution;

    public constructor(type: string, entity: string, startIndex: number, endIndex: number) {
        this.type = type;
        this.entity = entity;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
}

export interface ValueResolution {
    value: string | number
}

export interface MultipleValueResolution {
    values: any[]
}
