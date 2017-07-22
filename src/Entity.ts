import { startIndex } from './../test/common';
import { DEFAULT_SCORE, DEFAULT_START_INDEX, DEFAULT_END_INDEX } from './constants';

export interface Entity {
    readonly type: string;
    readonly entity: string;
} 

export interface EntityWithStartAndEnd extends Entity {
    readonly startIndex: number;
    readonly endIndex: number;
}

export interface EntityWithScore extends Entity {
    readonly score: number
}

export interface CustomEntity extends EntityWithStartAndEnd, EntityWithScore { }

export function createCustomEntity(entity: string, type: string, score = DEFAULT_SCORE, startIndex = DEFAULT_START_INDEX, endIndex = DEFAULT_END_INDEX ): CustomEntity {
    return {
        entity,
        type,
        score,
        startIndex,
        endIndex
    };
}