import * as chai from 'chai';
import * as mocha from 'mocha';
import { fromNow } from '../../src/common/utils';

const expect = chai.expect;
describe('Utils Test', () => {

    it('1. from Now should return XX months ago.', () => {
        const fromNowString = fromNow(1584657989);
        expect(fromNowString.endsWith('months ago')).true;
    });

});