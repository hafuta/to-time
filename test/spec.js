const expect = require('chai').expect;
const toTime = require('../lib');

describe('Invoking toTime', () => {

    describe('Types', () => {
        it('Should be function', () => {
            expect(toTime).to.be.a('function');
        });

        const methods = ['fromMilliseconds', 'fromSeconds', 'fromMinutes', 'fromHours', 'fromDays', 'fromWeeks', 'fromYears'];

        methods.forEach((m) => {
            it(`Should have a ${m} function`, () => {
                expect(toTime).to.have.property(m);
                expect(toTime[m]).to.be.a('function');
            });
        });
    });

    describe('Failing values', () => {

        const invalidValues = [
            5, 5000, {},
            new Function(), new Object(),
            '', 5.5, 5.600000, true, false, new Boolean(false), []
        ];

        it('Should fail', () => {
            invalidValues.forEach((f) => {
                expect(toTime.bind(this, f)).to.throw(Error);
            });
        });

    });

    describe('Failing simple formats', () => {

        const invalidFormats = [
            '30yy', '30 yearss', '5month', '5mon', '2500sec',
            '50', '3oyears', '30 minotes', '9wix', '10 months'
        ];
        it('Should fail', () => {
            invalidFormats.forEach((f) => {
                expect(toTime.bind(this, f)).to.throw(Error);
            });
        });

    });

    describe('Failing complex formats', () => {

        const invalidFormats = [
            '30years 2days@', '3oyears 5months', '7days 5weekss', '1y 2weeks 7 d 50minute; 9second',
            '25years - 7 months - 90 za'
        ];

        it('Should fail', () => {
            invalidFormats.forEach((f) => {
                expect(toTime.bind(this, f)).to.throw(Error);
            });
        });

    });

    describe('Should equal - simple values - seconds', () => {

        const SIMPLE = [{
            value: 86400,
            terms: [
                '1d', '1day', '1days', '1 day', '1 days',
                '24h', '24hour', '24hours', '24 hour', '24 hours',
                '1440m', '1440minute', '1440minutes', '1440 minute', '1440 minutes'
            ]
        }];

        SIMPLE.forEach((s) => {
            it(`Should equal ${s.value}`, () => {
                s.terms.forEach((t) => {
                    expect(toTime(t).seconds()).to.equal(s.value);
                });
            });
        });

    });

    describe('Should equal - simple values - minutes', () => {

        const SIMPLE = [{
            value: 1440,
            terms: [
                '24h', '24 h', '24hour', '24 hour', '24hours', '24hour',
                '86400s', '86400 s', '86400second', '86400 second', '86400seconds', '86400 seconds',
                '86400000ms', '86400000 ms', '86400000millisecond', '86400000 millisecond', '86400000milliseconds', '86400000 milliseconds'
            ]
        }];

        SIMPLE.forEach((s) => {
            it(`Should equal ${s.value}`, () => {
                s.terms.forEach((t) => {
                    expect(toTime(t).minutes()).to.equal(s.value);
                });
            });
        });

    });


    describe('Should equal - simple values - hours', () => {

        const SIMPLE = [{
            value: 5,
            terms: [
                '18000s', '18000 s', '18000second', '18000 second', '18000seconds', '18000 seconds',
                '300m', '300 m', '300minute', '300 minute', '300minutes', '300 minutes',
                '5h', '5 h', '5hour', '5 hour', '5hours', '5 hours'
            ]
        }];

        SIMPLE.forEach((s) => {
            it(`Should equal ${s.value}`, () => {
                s.terms.forEach((t) => {
                    expect(toTime(t).hours()).to.equal(s.value);
                });
            });
        });

    });


    describe('Should equal - simple values - days', () => {

        const SIMPLE = [{
            value: 2,
            terms: [
                '172800s', '172800 s', '172800second', '172800 second', '172800seconds', '172800 seconds',
                '2880m', '2880 m', '2880minute', '2880 minute', '2880 minutes', '2880 minutes',
                '48h', '48 h', '48hour', '48 hour', '48hours', '48 hours',
                '2d', '2 d', '2day', '2 day', '2days', '2 days'
            ]
        }];

        SIMPLE.forEach((s) => {
            it(`Should equal ${s.value}`, () => {
                s.terms.forEach((t) => {
                    expect(toTime(t).days()).to.equal(s.value);
                });
            });
        });

    });

    describe('Should equal - simple values - weeks', () => {

        const SIMPLE = [{
            value: 1,
            terms: [
                '168h', '168 h', '168hour', '168 hour', '168hours', '168 hours',
                '7d', '7 d', '7day', '7 day', '7days', '7 days',
                '1w', '1 w', '1week', '1 week', '1weeks', '1 weeks'
            ]
        }];

        SIMPLE.forEach((s) => {
            it(`Should equal ${s.value}`, () => {
                s.terms.forEach((t) => {
                    expect(toTime(t).weeks()).to.equal(s.value);
                });
            });
        });

    });

    describe('add functions', () => {
        it('Should equal to total of 1 minute', () => {
            expect(toTime('30s').addSeconds(30).minutes()).to.equal(1);
        });

        it('Should equal to total of 1 week', () => {
            expect(toTime('1d').addDays(1).addDays(2).addHours(48).addSeconds(86400).weeks()).to.equal(1);
        });

        it('Should equal to total of 1 year', () => {
            expect(toTime('4w').addDays(100).addSeconds(86400 * 10).addDays(50).addHours(168).addMinutes(10080).addDays(163).years()).to.equal(1);
        });
    });

    describe('Constructors', () => {
        expect(toTime.fromMilliseconds(30000).minutes()).to.equal(0.5);
        expect(toTime.fromSeconds(86400).days()).to.equal(1);
        expect(toTime.fromWeeks(4).addWeeks(4).weeks()).to.equal(8);
        expect(toTime.fromYears(2).addYears(1).addWeeks(4).addDays(365).minutes()).to.equal(40320 + 2102400);
        expect(toTime.fromHours(5).addHours(10).addMilliseconds(5).milliseconds()).to.equal(54000005);
        expect(toTime.fromMinutes(15).addHours(2).seconds()).to.equal(8100);
        expect(toTime.fromDays(10).addDays(2).addHours(24).days()).to.equal(13);
    });

    describe('humanize', () => {
        expect(toTime.fromHours(50).humanize()).to.equal('2 Days, 2 Hours');
    });

});