import { currentId } from 'async_hooks';
import { datetimeV2, datetimeV2Type } from './entityTypes';
import { ResolvablePrebuiltEntity, MultipleValueResolution } from './prebuiltEntities';
import * as moment from 'moment';

const momentDateTimeFormatString = "YYYY-MM-DD HH:mm:ss";
const momentDateFormatString = "YYYY-MM-DD";
const momentTimeFormatString = "HH:mm:ss";

export interface DateTimeV2Resolution {
    // timex is likely not needed for most users, so keep it optional
    timex?: string,
    type: string
}

export interface DateTimeV2ResolutionWithValue extends DateTimeV2Resolution {
    value: string
}

export interface DateTimeV2ResolutionWithRange extends DateTimeV2Resolution {
    start: string,
    end: string
}

export interface MultipleDateValueResoltuions extends MultipleValueResolution {
    values: DateTimeV2Resolution[]
}

export class DateTimeV2 extends ResolvablePrebuiltEntity {
    resolution: MultipleDateValueResoltuions

    private DateTimeV2() {}
    
    public static CreateDateSubEntities(inputDates: string | string[]):  DateTimeV2Resolution[] {
        if(typeof(inputDates) === 'string') {
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

    private static getDisambiguatedResolutions(inputDate: Date, relativeCurrentDate: Date, formatType: string): DateTimeV2ResolutionWithValue[] {
        const disambiguatedDates: Date[] = DateTimeV2.getDisambiguatedDates(inputDate, relativeCurrentDate);
        let momentFormatString: string;
        
        if(formatType === datetimeV2.datetimeV2DateTimeType) {
            momentFormatString = momentDateTimeFormatString;
        } else if (formatType === datetimeV2.datetimeV2DateType) {
            momentFormatString = momentDateFormatString;
        } else {
            // time
            momentFormatString = momentDateTimeFormatString;
        }

        return disambiguatedDates.map(date => {
            return {
                type: `${datetimeV2Type}.${formatType}`,
                value: moment(date).format(momentFormatString)
            };
        });
    }

    private static createDateTimeV2WithSubtype(subtype: string, entity: string, startIndex: number, endIndex: number, resolution: DateTimeV2Resolution[]) {
        const dateTimeV2Entity: DateTimeV2 = new DateTimeV2(`${datetimeV2Type}.${subtype}`, entity, startIndex, endIndex);
        
        dateTimeV2Entity.resolution = {
            values: resolution
        }

        return dateTimeV2Entity;
    }

    private static createDateTimeV2WithSubTypeWithAmbiguousDate(subType: string, entity: string, startIndex: number, endIndex: number, inputDate: Date, relativeCurrentDate: Date) {
        const disambiguatedResolution: DateTimeV2ResolutionWithValue[] = DateTimeV2.getDisambiguatedResolutions(inputDate, relativeCurrentDate, subType);
        
        return DateTimeV2.createDateTimeV2WithSubtype(subType, entity, startIndex, endIndex, disambiguatedResolution);
    }

    // relative year is the the base year to use
    public static createDateTimeV2_Date_EntityWithAmbiguousDate(entity: string, startIndex: number, endIndex: number, inputDate: Date, relativeCurrentDate: Date) {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(datetimeV2.datetimeV2DateType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }

    public static createDateTimeV2_DateTime_EntityWithAmbiguousDate(entity: string, startIndex: number, endIndex: number, inputDate: Date, relativeCurrentDate: Date) {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(datetimeV2.datetimeV2DateTimeType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }

    // still need to make the others
}


/*
builtin.datetimeV2.date	            tomorrow	        { "type": "builtin.datetimeV2.date", "entity": "tomorrow", "resolution": {"values": [{"timex": "2017-06-21","type": "date", "value": "2017-06-21"}]} }
builtin.datetimeV2.date	            january 10 2009	    { "type": "builtin.datetimeV2.date", "entity": "january 10 2009", "resolution": { "values": [ {"timex": "2009-01-10", "type": "date", "value": "2009-01-10" }] } }
builtin.datetimeV2.date	            monday	            { "entity": "monday", "type": "builtin.datetimeV2.date", "resolution": { "values": [{ "timex": "XXXX-WXX-1", "type": "date", "value": "2017-06-19" },{"timex": "XXXX-WXX-1","type": "date", "value": "2017-06-26"}]} }
builtin.datetimeV2.date	            next monday	        { "entity": "next monday", "type": "builtin.datetimeV2.date", "resolution": { "values": [{ "timex": "2017-06-26", "type": "date", "value": "2017-06-26" }] } }


builtin.datetimeV2.time	            3 : 00	            { "type": "builtin.datetimeV2.time", "entity": "3 : 00", "resolution": { "values": [{ "timex": "T03:00", "type": "time", "value": "03:00:00" }, { "timex": "T15:00", "type": "time", "value": "15:00:00" }]} }
builtin.datetimeV2.time	            4 pm	            { "type": "builtin.datetimeV2.time", "entity": "4 pm", "resolution": { "values": [{"timex": "T16", "type": "time", "value": "16:00:00"}] } }
builtin.datetimeV2.daterange	    next week	        { "entity": "next week", "type": "builtin.datetime.dateV2.daterange", "resolution": { "values": [{ "timex": "2017-W27", "type": "daterange", "start": "2017-06-26", "end": "2017-07-03"}] } }
builtin.datetimeV2.datetimerange	tomorrow morning	{ "entity": "tomorrow morning", "type": "builtin.datetimev2.datetimerange", "resolution": { "values": [{"timex": "2017-06-21TMO","type": "datetimerange", "start": "2017-06-21 08:00:00", "end": "2017-06-21 12:00:00"}]} }
builtin.datetimeV2.datetimerange	tonight	            { "entity": "tonight", "type": "builtin.datetimeV2.datetimerange", "resolution": { "values": [{"timex": "2017-06-20TNI","type": "datetimerange", "start": "2017-06-20 20:00:00", "end": "2017-06-20 23:59:59"}]} }
builtin.datetimeV2.duration	        for 3 hours	        { "type": "builtin.datetimeV2.duration", "entity": "3 hours", "resolution": { "values": [{ "timex": "PT3H", "type": "duration", "value": "10800"}] } }
builtin.datetimeV2.duration	        30 minutes long	    { "type": "builtin.datetimeV2.duration", "entity": "30 minutes", "resolution": { "values": [{ "timex": "PT30M", "type": "duration", "value": "1800"}] } }
builtin.datetimeV2.duration	        all day	            { "type": "builtin.datetimeV2.duration", "entity": "all day", "resolution": { "values": [{ "timex": "P1D", "type": "duration", "value": "86400"}] } }
builtin.datetimeV2.set	            daily	            { "type": "builtin.datetimeV2.set", "entity": "daily", "resolution": { "values": [{ "timex": "P1D", "type": "set", "value": "not resolved"}]} }
builtin.datetimeV2.set	            every tuesday	    { "entity": "every tuesday", "type": "builtin.datetimeV2.set", "resolution": { "values": [{ "timex": "XXXX-WXX-2", "type": "set", "value": "not resolved"}]} }
builtin.datetimeV2.set	            every week	        { "entity": "every week", "type": "builtin.datetimeV2.set", "resolution": {"time": "XXXX-WXX"} }


*/


