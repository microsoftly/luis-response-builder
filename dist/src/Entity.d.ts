export interface Entity {
    readonly type: string;
    readonly entity: string;
}
export interface EntityWithStartAndEnd extends Entity {
    readonly startIndex: number;
    readonly endIndex: number;
}
export interface EntityWithScore extends Entity {
    readonly score: number;
}
export interface CustomEntity extends EntityWithStartAndEnd, EntityWithScore {
}
export interface PrebuiltEntity extends Entity {
}
export declare function createCustomEntity(entity: string, type: string, score?: number, startIndex?: number, endIndex?: number): CustomEntity;
