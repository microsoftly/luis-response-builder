import { ResolvablePrebuiltEntity, MultipleValueResolution } from './prebuiltEntities';
export interface DateTimeV2Resolution {
    timex?: string;
    type: string;
}
export interface DateTimeV2ResolutionWithValue extends DateTimeV2Resolution {
    value: string;
}
export interface DateTimeV2ResolutionWithRange extends DateTimeV2Resolution {
    start: string;
    end: string;
}
export interface MultipleDateValueResoltuions extends MultipleValueResolution {
    values: DateTimeV2Resolution[];
}
export declare class DateTimeV2 extends ResolvablePrebuiltEntity {
    resolution: MultipleDateValueResoltuions;
    private DateTimeV2();
    static CreateDateSubEntities(inputDates: string | string[]): DateTimeV2Resolution[];
    static getDisambiguatedDates(inputDate: Date, relativeCurrentDate: Date): Date[];
    private static getDisambiguatedResolutions(inputDate, relativeCurrentDate, formatType);
    private static createDateTimeV2WithSubtype(subtype, entity, startIndex, endIndex, resolution);
    private static createDateTimeV2WithSubTypeWithAmbiguousDate(subType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    static createDateTimeV2_Date_EntityWithAmbiguousDate(entity: string, startIndex: number, endIndex: number, inputDate: Date, relativeCurrentDate: Date): DateTimeV2;
    static createDateTimeV2_DateTime_EntityWithAmbiguousDate(entity: string, startIndex: number, endIndex: number, inputDate: Date, relativeCurrentDate: Date): DateTimeV2;
}
