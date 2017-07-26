"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DateTimeV2_1 = require("../../src/prebuilt/DateTimeV2");
const common_1 = require("../common");
describe('DateTimeV2 prebuilt', () => {
    describe('date disambiguation', () => {
        // updating this shouldn't matter because we don't actually parse it
        const inputDateString = '9/22';
        const inputDate = new Date('9/22 12:55:00');
        const earlierRelativeDate = new Date('9/21/2015');
        const laterRelativeDate = new Date('9/23/2015');
        function getDisambiguatedDateStrings(createFunction, relativeDate, expectedType) {
            const entity = createFunction(inputDateString, common_1.startIndex, common_1.endIndex, inputDate, relativeDate);
            common_1.testCommonEntityFields(entity, inputDateString, expectedType);
            chai_1.expect(entity.resolution).not.to.be.null;
            const values = entity.resolution.values;
            chai_1.expect(values).to.be.an('array');
            chai_1.expect(values.length).to.be.equal(2);
            values.forEach(val => chai_1.expect(val.type).to.be.equal(expectedType));
            return values.map(value => value.value);
        }
        function ensureResolutionExists(entity) {
            chai_1.expect(entity.resolution).not.to.be.null;
        }
        function ensureResolutionValueIsArrayOfSize2(entity) {
            const values = entity.resolution.values;
            chai_1.expect(values).to.be.an('array');
            chai_1.expect(values.length).to.be.equal(2);
        }
        function ensureResolutionValuesAreOfCorrectType(entity, expectedType) {
            const values = entity.resolution.values;
            values.forEach(val => chai_1.expect(val.type).to.be.equal(expectedType));
        }
        function testDisambiguatedDateValueResolution(entity, expectedType) {
            ensureResolutionExists(entity);
            ensureResolutionValueIsArrayOfSize2(entity);
            ensureResolutionValuesAreOfCorrectType(entity, expectedType);
        }
        function convertEntityResolutionToDateStringsInPlace(entity) {
            const values = entity.resolution.values;
            return values.map(value => value.value);
        }
        function selectCreateDisambiguatedDateEntityFunction(entityType) {
            if (entityType === 'builtin.datetimeV2.date') {
                return DateTimeV2_1.DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate;
            }
            else {
                return DateTimeV2_1.DateTimeV2.createDateTimeV2_DateTime_EntityWithAmbiguousDate;
            }
        }
        function testDisambiguatedDateEntity(entity, inputDateString, entityType, expectedEarlierDate, expectedLaterDate) {
            common_1.testCommonEntityFields(entity, inputDateString, entityType);
            testDisambiguatedDateValueResolution(entity, entityType);
            const [earlierResolvedDate, laterResolvedDate] = convertEntityResolutionToDateStringsInPlace(entity);
            chai_1.expect(earlierResolvedDate).to.be.equal(expectedEarlierDate);
            chai_1.expect(laterResolvedDate).to.be.equal(expectedLaterDate);
        }
        function testDateDisambiguationByEntityType(entityType, earlierDateTimeResolution, middleDateTimeResolution, laterDateTimeResolution) {
            const createDisambiguatedDateEntityFn = selectCreateDisambiguatedDateEntityFunction(entityType);
            const entityWith_Earlier_RelativeDate = createDisambiguatedDateEntityFn(inputDateString, common_1.startIndex, common_1.endIndex, inputDate, earlierRelativeDate);
            const entityWith_Later_RelativeDate = createDisambiguatedDateEntityFn(inputDateString, common_1.startIndex, common_1.endIndex, inputDate, laterRelativeDate);
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
        });
    });
});
//# sourceMappingURL=DateTimeV2.spec.js.map