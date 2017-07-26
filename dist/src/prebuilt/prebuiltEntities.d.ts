import { PrebuiltEntity } from './../Entity';
export declare class ResolvablePrebuiltEntity implements PrebuiltEntity {
    readonly type: string;
    readonly entity: string;
    readonly startIndex: number;
    readonly endIndex: number;
    resolution: ValueResolution | MultipleValueResolution;
    constructor(type: string, entity: string, startIndex: number, endIndex: number);
}
export interface ValueResolution {
    value: string | number;
}
export interface MultipleValueResolution {
    values: any[];
}
