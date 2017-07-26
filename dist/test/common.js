"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
// start and end index values don't need to actually match. Just make sure they are persisted
exports.startIndex = 0;
exports.endIndex = 4;
function testCommonEntityFields(entityObject, expectedEntityString, expectedType) {
    chai_1.expect(entityObject.startIndex).to.be.equal(exports.startIndex);
    chai_1.expect(entityObject.startIndex).to.be.equal(exports.startIndex);
    chai_1.expect(entityObject.entity).to.be.equal(expectedEntityString);
    chai_1.expect(entityObject.type).to.be.equal(expectedType);
}
exports.testCommonEntityFields = testCommonEntityFields;
//# sourceMappingURL=common.js.map