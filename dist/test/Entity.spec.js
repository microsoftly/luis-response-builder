"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_1 = require("../src");
describe('createCustomEntity', () => {
    it('correctly generates custom entity entry', () => {
        const customEntity = src_1.createCustomEntity("taco bell", "restaurantName", .89, 4, 13);
        chai_1.expect(customEntity.entity).to.be.equal('taco bell');
        chai_1.expect(customEntity.type).to.be.equal('restaurantName');
        chai_1.expect(customEntity.score).to.be.equal(.89);
    });
});
//# sourceMappingURL=Entity.spec.js.map