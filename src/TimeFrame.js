'use strict';

const BigNumber = require('bignumber.js');
const constants = require('./constants');

const transforms = [
    ['Years', constants.SECONDS_IN_YEAR],
    ['Weeks', constants.SECONDS_IN_WEEK],
    ['Days', constants.SECONDS_IN_DAY],
    ['Hours', constants.SECONDS_IN_HOUR],
    ['Minutes', constants.SECONDS_IN_MINUTE],
    ['Seconds', constants.ONE_SECOND],
    ['Milliseconds', constants.SECONDS_IN_MILLISECOND]
];

/**
 * Function to compute modulo value
 * JS doesn't have a modulo operator built into the language
 * Code taken from this StackOverflow post:
 * http://stackoverflow.com/questions/3966484/floating-point-numbers-and-javascript-modulus-operator
 */
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split('.')[1] || '').length;
    const stepDecCount = (step.toString().split('.')[1] || '').length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace('.', ''));
    const stepInt = parseInt(step.toFixed(decCount).replace('.', ''));

    return (valInt % stepInt) / Math.pow(10, decCount);
}

class TimeFrame {
    constructor(seconds) {
        if (seconds instanceof BigNumber) {
            this.val = seconds;
        } else if (!isNaN(seconds)) {
            this.val = new BigNumber(seconds);
        }

        this.milliseconds = this.ms.bind(this);
        this.second = this.seconds.bind(this);
        this.minute = this.minutes.bind(this);
        this.hour = this.hours.bind(this);
        this.day = this.days.bind(this);
        this.week = this.weeks.bind(this);
        this.year = this.years.bind(this);
        this.toString = this.humanize.bind(this);
    }

    ms() {
        return this.val.times(constants.MILLISECONDS_IN_SECOND).toNumber();
    }

    seconds() {
        return this.val.toNumber();
    }

    minutes() {
        return this.val.dividedBy(constants.SECONDS_IN_MINUTE).toNumber();
    }

    hours() {
        return this.val.dividedBy(constants.SECONDS_IN_HOUR).toNumber();
    }

    days() {
        return this.val.dividedBy(constants.SECONDS_IN_DAY).toNumber();
    }

    weeks() {
        return this.val.dividedBy(constants.SECONDS_IN_WEEK).toNumber();
    }

    years() {
        return this.val.dividedBy(constants.SECONDS_IN_YEAR).toNumber();
    }

    addSeconds(seconds) {
        this.val = this.val.plus(seconds);
        return this;
    }

    addMinutes(minutes) {
        this.val = this.val.plus(minutes * constants.SECONDS_IN_MINUTE);
        return this;
    }

    addHours(hours) {
        this.val = this.val.plus(hours * constants.SECONDS_IN_HOUR);
        return this;
    }

    addDays(days) {
        this.val = this.val.plus(days * constants.SECONDS_IN_DAY);
        return this;
    }

    addWeeks(weeks) {
        this.val = this.val.plus(weeks * constants.SECONDS_IN_WEEK);
        return this;
    }

    addYears(years) {
        this.val = this.val.plus(years * constants.SECONDS_IN_YEAR);
        return this;
    }

    addMilliseconds(milliseconds) {
        this.val = this.val.plus(milliseconds * constants.SECONDS_IN_MILLISECOND);
        return this;
    }

    humanize() {
        let val = this.val;
        const results = [];
        
        transforms.forEach(t => {
            const div = Math.floor(val / t[1]);
            if (div > 0) {
                results.push(div + ' ' + t[0]);
            }
            val = floatSafeRemainder(val, t[1]);
        });

        return results.join(', ');
    }
}

module.exports = TimeFrame;