import { currentId } from 'async_hooks';
import * as moment from 'moment';
import { IMultipleValueResolution, ResolvablePrebuiltEntity } from './prebuiltEntities';
import { datetimeV2, datetimeV2Type } from './prebuiltEntityTypes';

const momentDateTimeFormatString = 'YYYY-MM-DD HH:mm:ss';
const momentDateFormatString = 'YYYY-MM-DD';
const momentTimeFormatString = 'HH:mm:ss';

export interface IDateTimeV2Resolution {
    // timex is likely not needed for most users, so keep it optional
    timex?: string;
    type: string;
}

export interface IDateTimeV2ResolutionWithValue extends IDateTimeV2Resolution {
    value: string;
}

export interface IDateTimeV2ResolutionWithRange extends IDateTimeV2Resolution {
    start: string;
    end: string;
}

export interface IMultipleDateValueResoltuions extends IMultipleValueResolution {
    values: IDateTimeV2Resolution[];
}

export class DateTimeV2 extends ResolvablePrebuiltEntity {
    public resolution: IMultipleDateValueResoltuions;

    public static CreateDateSubEntities(inputDates: string | string[]):  IDateTimeV2Resolution[] {
        if (typeof(inputDates) === 'string') {
            inputDates = [inputDates];
        }

        return inputDates.map((date: string) => {
            return {
                value: date,
                type: `${datetimeV2Type}.${datetimeV2.datetimeV2DateType}`
            };
        });
    }

    public static getDisambiguatedDates(inputDate: Date, relativeCurrentDate: Date): Date[] {
        let dates: Date[];
        const currentYear: number = relativeCurrentDate.getFullYear();

        // ensure the input date has the year adjusted so timing is correct
        inputDate.setFullYear(currentYear);

        const disambiguatedDate: Date = new Date(inputDate);
        const shouldUseEarlierYear: boolean = inputDate < relativeCurrentDate;

        if (shouldUseEarlierYear) {
            disambiguatedDate.setFullYear(currentYear - 1);
            dates = [ disambiguatedDate, inputDate ];
        } else {
            disambiguatedDate.setFullYear(currentYear + 1);
            dates = [ inputDate, disambiguatedDate ];
        }

        return dates;
    }

    // relative year is the the base year to use
    public static createDateTimeV2_Date_EntityWithAmbiguousDate(
        entity: string,
        startIndex: number,
        endIndex: number,
        inputDate: Date,
        relativeCurrentDate: Date
    ): DateTimeV2 {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(datetimeV2.datetimeV2DateType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }

    public static createDateTimeV2_DateTime_EntityWithAmbiguousDate(
        entity: string,
        startIndex: number,
        endIndex: number,
        inputDate: Date,
        relativeCurrentDate: Date
    ): DateTimeV2 {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(datetimeV2.datetimeV2DateTimeType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }

    private static getDisambiguatedResolutions(
        inputDate: Date,
        relativeCurrentDate: Date,
        formatType: string
    ): IDateTimeV2ResolutionWithValue[] {
        const disambiguatedDates: Date[] = DateTimeV2.getDisambiguatedDates(inputDate, relativeCurrentDate);
        let momentFormatString: string;

        if (formatType === datetimeV2.datetimeV2DateTimeType) {
            momentFormatString = momentDateTimeFormatString;
        } else if (formatType === datetimeV2.datetimeV2DateType) {
            momentFormatString = momentDateFormatString;
        } else {
            // time
            momentFormatString = momentDateTimeFormatString;
        }

        return disambiguatedDates.map((date: Date) => {
            return {
                type: `${datetimeV2Type}.${formatType}`,
                value: moment(date).format(momentFormatString)
            };
        });
    }

    private static createDateTimeV2WithSubtype(
        subtype: string,
        entity: string,
        startIndex: number,
        endIndex: number,
        resolution: IDateTimeV2Resolution[]
    ): DateTimeV2 {
        const dateTimeV2Entity: DateTimeV2 = new DateTimeV2(`${datetimeV2Type}.${subtype}`, entity, startIndex, endIndex);

        dateTimeV2Entity.resolution = {
            values: resolution
        };

        return dateTimeV2Entity;
    }

    private static createDateTimeV2WithSubTypeWithAmbiguousDate(
        subType: string,
        entity: string,
        startIndex: number,
        endIndex: number,
        inputDate: Date,
        relativeCurrentDate: Date
    ): DateTimeV2 {
        const disambiguatedResolution: IDateTimeV2ResolutionWithValue[] =
            DateTimeV2.getDisambiguatedResolutions(inputDate, relativeCurrentDate, subType);

        return DateTimeV2.createDateTimeV2WithSubtype(subType, entity, startIndex, endIndex, disambiguatedResolution);
    }

    // still need to make the others
}
