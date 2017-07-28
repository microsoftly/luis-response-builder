import { DEFAULT_END_INDEX, DEFAULT_SCORE, DEFAULT_START_INDEX } from './constants';

export interface IEntity {
    readonly type: string;
    readonly entity: string;
}

export interface IEntityWithStartAndEnd extends IEntity {
    readonly startIndex: number;
    readonly endIndex: number;
}

export interface IEntityWithScore extends IEntity {
    readonly score: number;
}

export interface ICustomEntity extends IEntityWithStartAndEnd, IEntityWithScore { }
export interface IPrebuiltEntity extends IEntity {}

export function createCustomEntity(
    entity: string,
    type: string,
    score: number = DEFAULT_SCORE,
    startIndex: number = DEFAULT_START_INDEX,
    endIndex: number = DEFAULT_END_INDEX
): ICustomEntity {
    return {
        entity,
        type,
        score,
        startIndex,
        endIndex
    };
}
