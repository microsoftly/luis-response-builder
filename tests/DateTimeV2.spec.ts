import { expect } from 'chai';
import { DateTimeV2, DateTimeV2ResolutionWithValue } from '../prebuilt/DateTimeV2';
import { testCommonEntityFields, startIndex, endIndex } from './common';

describe('DateTimeV2 prebuilt', () => {
    describe('date disambiguation', () => {
        // updating this shouldn't matter because we don't actually parse it
        const inputDateString = '9/22';
        const inputDate = new Date('9/22 12:55:00');
        const earlierRelativeDate = new Date('9/21/2015');
        const laterRelativeDate = new Date('9/23/2015');

        function getDisambiguatedDateStrings(createFunction, relativeDate, expectedType) {
            const entity = createFunction(inputDateString, startIndex, endIndex, inputDate, relativeDate);
            testCommonEntityFields(entity, inputDateString, expectedType);

            expect(entity.resolution).not.to.be.null;
            
            const values = entity.resolution.values;

            expect(values).to.be.an('array')
            expect(values.length).to.be.equal(2);
            values.forEach(val => expect(val.type).to.be.equal(expectedType));

            return values.map(value => (value as DateTimeV2ResolutionWithValue).value);
        }

        function ensureResolutionExists(entity) {
            expect(entity.resolution).not.to.be.null;
        }

        function ensureResolutionValueIsArrayOfSize2(entity) {
            const values = entity.resolution.values; 
            expect(values).to.be.an('array');
            expect(values.length).to.be.equal(2);
        }

        function ensureResolutionValuesAreOfCorrectType(entity, expectedType) {
            const values = entity.resolution.values;
            values.forEach(val => expect(val.type).to.be.equal(expectedType));
        }

        function testDisambiguatedDateValueResolution(entity, expectedType) {
            ensureResolutionExists(entity);
            ensureResolutionValueIsArrayOfSize2(entity);
            ensureResolutionValuesAreOfCorrectType(entity, expectedType);
        }

        function convertEntityResolutionToDateStringsInPlace(entity) {
            const values = entity.resolution.values; 
            return values.map(value => (value as DateTimeV2ResolutionWithValue).value);
        }

        function selectCreateDisambiguatedDateEntityFunction(entityType) {
            if(entityType === 'builtin.datetimeV2.date') {
                return DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate 
            } else {
                return DateTimeV2.createDateTimeV2_DateTime_EntityWithAmbiguousDate;
            }
        }

        function testDisambiguatedDateEntity(entity, inputDateString, entityType, expectedEarlierDate, expectedLaterDate) {
            testCommonEntityFields(entity, inputDateString, entityType);
            testDisambiguatedDateValueResolution(entity, entityType);
            
            const [earlierResolvedDate, laterResolvedDate] = convertEntityResolutionToDateStringsInPlace(entity);

            expect(earlierResolvedDate).to.be.equal(expectedEarlierDate);
            expect(laterResolvedDate).to.be.equal(expectedLaterDate);
        }

        function testDateDisambiguationByEntityType(entityType, earlierDateTimeResolution, middleDateTimeResolution, laterDateTimeResolution) {
            const createDisambiguatedDateEntityFn = selectCreateDisambiguatedDateEntityFunction(entityType);

            const entityWith_Earlier_RelativeDate 
                = createDisambiguatedDateEntityFn(inputDateString, startIndex, endIndex, inputDate, earlierRelativeDate); 
            const entityWith_Later_RelativeDate 
                = createDisambiguatedDateEntityFn(inputDateString, startIndex, endIndex, inputDate, laterRelativeDate); 

            testDisambiguatedDateEntity(entityWith_Later_RelativeDate, inputDateString, entityType, earlierDateTimeResolution, middleDateTimeResolution);
            testDisambiguatedDateEntity(entityWith_Earlier_RelativeDate, inputDateString, entityType, middleDateTimeResolution, laterDateTimeResolution);
        }

        it('builtin.datetimeV2.date test', () => {
            const expectedEntityType = 'builtin.datetimeV2.date';
            const earlierExpectedDate = '2014-09-22';
            const middleExpectedDate = '2015-09-22';
            const laterExpectedDate = '2016-09-22';
            
            testDateDisambiguationByEntityType(expectedEntityType, earlierExpectedDate, middleExpectedDate, laterExpectedDate);
        });

        it('builtin.datetimeV2.datetime test', () => {
            const expectedEntityType = 'builtin.datetimeV2.datetime';
            const earlierExpectedDate = '2014-09-22 12:55:00';
            const middleExpectedDate = '2015-09-22 12:55:00';
            const laterExpectedDate = '2016-09-22 12:55:00';
            
            testDateDisambiguationByEntityType(expectedEntityType, earlierExpectedDate, middleExpectedDate, laterExpectedDate);
        })
    });
});