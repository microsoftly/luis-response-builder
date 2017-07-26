"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prebuiltEntityTypes_1 = require("./prebuiltEntityTypes");
const prebuiltEntities_1 = require("./prebuiltEntities");
const moment = require("moment");
const momentDateTimeFormatString = "YYYY-MM-DD HH:mm:ss";
const momentDateFormatString = "YYYY-MM-DD";
const momentTimeFormatString = "HH:mm:ss";
class DateTimeV2 extends prebuiltEntities_1.ResolvablePrebuiltEntity {
    DateTimeV2() { }
    static CreateDateSubEntities(inputDates) {
        if (typeof (inputDates) === 'string') {
            inputDates = [inputDates];
        }
        return inputDates.map((date) => {
            return {
                value: date,
                type: `${prebuiltEntityTypes_1.datetimeV2Type}.${prebuiltEntityTypes_1.datetimeV2.datetimeV2DateType}`
            };
        });
    }
    static getDisambiguatedDates(inputDate, relativeCurrentDate) {
        let dates;
        const currentYear = relativeCurrentDate.getFullYear();
        // ensure the input date has the year adjusted so timing is correct
        inputDate.setFullYear(currentYear);
        const disambiguatedDate = new Date(inputDate);
        const shouldUseEarlierYear = inputDate < relativeCurrentDate;
        if (shouldUseEarlierYear) {
            disambiguatedDate.setFullYear(currentYear - 1);
            dates = [disambiguatedDate, inputDate];
        }
        else {
            disambiguatedDate.setFullYear(currentYear + 1);
            dates = [inputDate, disambiguatedDate];
        }
        return dates;
    }
    static getDisambiguatedResolutions(inputDate, relativeCurrentDate, formatType) {
        const disambiguatedDates = DateTimeV2.getDisambiguatedDates(inputDate, relativeCurrentDate);
        let momentFormatString;
        if (formatType === prebuiltEntityTypes_1.datetimeV2.datetimeV2DateTimeType) {
            momentFormatString = momentDateTimeFormatString;
        }
        else if (formatType === prebuiltEntityTypes_1.datetimeV2.datetimeV2DateType) {
            momentFormatString = momentDateFormatString;
        }
        else {
            // time
            momentFormatString = momentDateTimeFormatString;
        }
        return disambiguatedDates.map(date => {
            return {
                type: `${prebuiltEntityTypes_1.datetimeV2Type}.${formatType}`,
                value: moment(date).format(momentFormatString)
            };
        });
    }
    static createDateTimeV2WithSubtype(subtype, entity, startIndex, endIndex, resolution) {
        const dateTimeV2Entity = new DateTimeV2(`${prebuiltEntityTypes_1.datetimeV2Type}.${subtype}`, entity, startIndex, endIndex);
        dateTimeV2Entity.resolution = {
            values: resolution
        };
        return dateTimeV2Entity;
    }
    static createDateTimeV2WithSubTypeWithAmbiguousDate(subType, entity, startIndex, endIndex, inputDate, relativeCurrentDate) {
        const disambiguatedResolution = DateTimeV2.getDisambiguatedResolutions(inputDate, relativeCurrentDate, subType);
        return DateTimeV2.createDateTimeV2WithSubtype(subType, entity, startIndex, endIndex, disambiguatedResolution);
    }
    // relative year is the the base year to use
    static createDateTimeV2_Date_EntityWithAmbiguousDate(entity, startIndex, endIndex, inputDate, relativeCurrentDate) {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(prebuiltEntityTypes_1.datetimeV2.datetimeV2DateType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }
    static createDateTimeV2_DateTime_EntityWithAmbiguousDate(entity, startIndex, endIndex, inputDate, relativeCurrentDate) {
        return DateTimeV2.createDateTimeV2WithSubTypeWithAmbiguousDate(prebuiltEntityTypes_1.datetimeV2.datetimeV2DateTimeType, entity, startIndex, endIndex, inputDate, relativeCurrentDate);
    }
}
exports.DateTimeV2 = DateTimeV2;
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
//# sourceMappingURL=DateTimeV2.js.map