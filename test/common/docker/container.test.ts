
import { Usage } from "../../../src/common/docker/container";

import * as mocha from 'mocha';
import * as chai from 'chai';

const expect = chai.expect;
describe('Usage Empty Data Test', () => {

    it('1. x array length of empty usage should be 0', () => {
        expect(Usage.EMPTY.x.length).to.equal(0);
    });

    it('2. y array length of empty usage should be 0', () => {
        expect(Usage.EMPTY.y.length).to.equal(0);
    });

});