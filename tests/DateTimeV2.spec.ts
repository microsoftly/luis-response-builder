import { expect } from 'chai';
import { DateTimeV2, DateTimeV2ResolutionWithValue } from '../prebuilt/DateTimeV2';

describe('DateTimeV2 prebuilt', () => {
    // start and end index values don't need to actually match. Just make sure they are persisted
    const startIndex = 0;
    const endIndex = 4;

    describe('date disambiguation', () => {
        const inputDateString = '9/22';
        const inputDate = new Date('9/22 12:55:00');
        const earlierRelativeDate = new Date('9/21/2015');
        const laterRelativeDate = new Date('9/23/2015');

        function getDisambiguatedDateStrings(createFunction, relativeDate, expectedType) {
            const entity = createFunction(inputDateString, startIndex, endIndex, inputDate, relativeDate);
            expect(entity.startIndex).to.be.equal(startIndex);
            expect(entity.endIndex).to.be.equal(endIndex);
            expect(entity.entity).to.be.equal(inputDateString);
            expect(entity.type).to.be.equal(expectedType);
            expect(entity.resolution).not.to.be.null;
            
            const values = entity.resolution.values;

            expect(values).to.be.an('array')
            expect(values.length).to.be.equal(2);
            values.forEach(val => expect(val.type).to.be.equal(expectedType));

            return values.map(value => (value as DateTimeV2ResolutionWithValue).value);
        }

        it('builtin.datetimeV2.date test', () => {
            const [firstEarlierRelativeDateResolution, secondEarlierRelativeDateResolution] = 
                getDisambiguatedDateStrings(DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate, earlierRelativeDate, 'builtin.datetimeV2.date');
            const [firstLaterRelativeDateResolution, secondLaterRelativeDateResolution] = 
                getDisambiguatedDateStrings(DateTimeV2.createDateTimeV2_Date_EntityWithAmbiguousDate, laterRelativeDate, 'builtin.datetimeV2.date');

            expect(firstLaterRelativeDateResolution).to.be.equal('2014-09-22')
            expect(secondLaterRelativeDateResolution).to.be.equal('2015-09-22')

            expect(firstEarlierRelativeDateResolution).to.be.equal('2015-09-22')
            expect(secondEarlierRelativeDateResolution).to.be.equal('2016-09-22')
        });

        it('builtin.datetimeV2.datetime test', () => {
            const [firstEarlierRelativeDateResolution, secondEarlierRelativeDateResolution] = 
                getDisambiguatedDateStrings(DateTimeV2.createDateTimeV2_DateTime_EntityWithAmbiguousDate, earlierRelativeDate, 'builtin.datetimeV2.datetime');
            const [firstLaterRelativeDateResolution, secondLaterRelativeDateResolution] = 
                getDisambiguatedDateStrings(DateTimeV2.createDateTimeV2_DateTime_EntityWithAmbiguousDate, laterRelativeDate, 'builtin.datetimeV2.datetime');

            expect(firstLaterRelativeDateResolution).to.be.equal('2014-09-22 12:55:00')
            expect(secondLaterRelativeDateResolution).to.be.equal('2015-09-22 12:55:00')

            expect(firstEarlierRelativeDateResolution).to.be.equal('2015-09-22 12:55:00')
            expect(secondEarlierRelativeDateResolution).to.be.equal('2016-09-22 12:55:00')
        })
    });
});