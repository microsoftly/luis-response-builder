import { expect } from 'chai';
import { createCustomEntity } from '../src';

describe('createCustomEntity', () => {
    it('correctly generates custom entity entry', () => {
        const customEntity = createCustomEntity("taco bell", "restaurantName", .89, 4, 13);
        expect(customEntity.entity).to.be.equal('taco bell');
        expect(customEntity.type).to.be.equal('restaurantName');
        expect(customEntity.score).to.be.equal(.89);
    })
})