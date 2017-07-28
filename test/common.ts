import { expect } from 'chai';

// start and end index values don't need to actually match. Just make sure they are persisted
export const startIndex = 0;
export const endIndex = 4;

export function testCommonEntityFields(entityObject, expectedEntityString, expectedType) {
    expect(entityObject.startIndex).to.be.equal(startIndex)
    expect(entityObject.startIndex).to.be.equal(startIndex)
    expect(entityObject.entity).to.be.equal(expectedEntityString);
    expect(entityObject.type).to.be.equal(expectedType);
}
