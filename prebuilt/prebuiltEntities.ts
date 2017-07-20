export interface PrebuiltEntity {
    readonly type: string;
    readonly entity: string;
} 

export interface PrebuiltEntityWithStartAndEnd extends PrebuiltEntity {
    readonly startIndex: number;
    readonly endIndex: number;

}
export class ResolvablePrebuiltEntity implements PrebuiltEntity {
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
