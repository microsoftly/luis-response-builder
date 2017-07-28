import { IPrebuiltEntity } from './../Entity';

export class ResolvablePrebuiltEntity implements IPrebuiltEntity {
    public readonly type: string;
    public readonly entity: string;
    public readonly startIndex: number;
    public readonly endIndex: number;
    public resolution: IValueResolution | IMultipleValueResolution;

    public constructor(type: string, entity: string, startIndex: number, endIndex: number) {
        this.type = type;
        this.entity = entity;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
}

export interface IValueResolution {
    value: string | number;
}

export interface IMultipleValueResolution {
    values: {}[];
}
