const expect = require('chai').expect;
const toTime = require('../lib/to-time.min');

describe('UMD bundle (lib/to-time.min)', () => {
    it('exports default callable', () => {
        expect(toTime).to.be.a('function');
    });

    it('parses duration strings', () => {
        expect(toTime('1d').days()).to.equal(1);
    });

    it('exposes factory helpers', () => {
        expect(toTime.fromSeconds(86400).days()).to.equal(1);
    });

    it('humanize matches expectations', () => {
        expect(toTime.fromHours(50).humanize()).to.equal('2 Days, 2 Hours');
    });
});
