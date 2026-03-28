import { expect } from 'chai';
import toTime from '../dist/index.mjs';

describe('dist ESM build', () => {
    it('exports default callable', () => {
        expect(toTime).to.be.a('function');
    });

    it('parses duration strings', () => {
        expect(toTime('1d').days()).to.equal(1);
    });

    it('exposes factory helpers', () => {
        expect(toTime.fromSeconds(86400).days()).to.equal(1);
    });
});
