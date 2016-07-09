'use strict';

(function() {

    // Time constants used across the script
    var SECONDS_IN_YEAR = 31536000;
    var SECONDS_IN_DAY = 86400;
    var SECONDS_IN_HOUR = 3600;
    var SECONDS_IN_MINUTE = 60;
    var SECONDS_IN_MILLISECOND = 0.001;
    var MILLISECONDS_IN_SECOND = 1000;
    var ONE_SECOND = 1;

    var TimeSpan = (function TimeSpan() {
        function TimeSpan(seconds) {
            this.val = seconds;
        }

        //Converters
        TimeSpan.prototype.ms = TimeSpan.prototype.milliseconds = function ms() {
            return this.val * MILLISECONDS_IN_SECOND;
        };

        TimeSpan.prototype.seconds = TimeSpan.prototype.second = function seconds() {
            return this.val;
        };

        TimeSpan.prototype.minutes = TimeSpan.prototype.minute = function minutes() {
            return this.val / SECONDS_IN_MINUTE;
        };

        TimeSpan.prototype.hours = TimeSpan.prototype.hour = function hours() {
            return this.val / SECONDS_IN_HOUR;
        };

        TimeSpan.prototype.days = TimeSpan.prototype.day = function days() {
            return this.val / SECONDS_IN_DAY;
        };

        TimeSpan.prototype.years = TimeSpan.prototype.year = function years() {
            return this.val / SECONDS_IN_YEAR;
        };

        //Appenders
        TimeSpan.prototype.addSeconds = function(seconds) {
            this.val += seconds;
            return this;
        };

        TimeSpan.prototype.addMinutes = function(minutes) {
            this.val += minutes * SECONDS_IN_MINUTE;
            return this;
        };

        TimeSpan.prototype.addHours = function(hours) {
            this.val += hours * SECONDS_IN_HOUR;
            return this;
        };

        TimeSpan.prototype.addDays = function(days) {
            this.val += days * SECONDS_IN_DAY;
            return this;
        };

        TimeSpan.prototype.addYears = function(years) {
            this.val += years * SECONDS_IN_YEAR;
            return this;
        };

        TimeSpan.prototype.addMilliseconds = function(milliseconds) {
            this.val += milliseconds * SECONDS_IN_MILLISECOND;
            return this;
        };

        //Formaters
        TimeSpan.prototype.humanize = function humanize() {
            var val = this.val;

            var transforms = [
                ['Years', SECONDS_IN_YEAR],
                ['Days', SECONDS_IN_DAY],
                ['Hours', SECONDS_IN_HOUR],
                ['Minutes', SECONDS_IN_MINUTE],
                ['Seconds', ONE_SECOND],
                ['Milliseconds', SECONDS_IN_MILLISECOND]
            ];

            /**
             * Function to compute modulo value
             * JS doesn't have a modulo operator built into the language
             * Code taken from this StackOverflow post:
             * http://stackoverflow.com/questions/3966484/floating-point-numbers-and-javascript-modulus-operator
             */
            function floatSafeRemainder(val, step) {
                var valDecCount = (val.toString().split('.')[1] || '').length;
                var stepDecCount = (step.toString().split('.')[1] || '').length;
                var decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
                var valInt = parseInt(val.toFixed(decCount).replace('.', ''));
                var stepInt = parseInt(step.toFixed(decCount).replace('.', ''));

                return (valInt % stepInt) / Math.pow(10, decCount);
            }

            var results = [];
            transforms.forEach(function(t) {
                if (typeof t[2] !== 'undefined' && t[2] === true) {
                    return;
                }
                var div = Math.floor(val / t[1]);
                if (div > 0) {
                    results.push(div + ' ' + t[0]);
                }
                val = floatSafeRemainder(val, t[1]);
            });

            return results.join(', ');
        };

        TimeSpan.prototype.toString = function toString() {
            return this.humanize(false);
        };

        return TimeSpan;
    }());

    var toTime = (function() {
        function toTime(text) {
            var units = {};
            units.y = units.year = units.years = SECONDS_IN_YEAR;
            units.d = units.day = units.days = SECONDS_IN_DAY;
            units.h = units.hour = units.hours = SECONDS_IN_HOUR;
            units.m = units.minute = units.minutes = SECONDS_IN_MINUTE;
            units.s = units.second = units.seconds = ONE_SECOND;
            units.ms = units.millisecond = units.milliseconds = SECONDS_IN_MILLISECOND;

            var matchPattern = /^[\d]+[\w]+$/;

            var splitted = text.toLowerCase()
                //Replace double whitespaces with single whitespace
                .replace(/\s+/gi, ' ')
                //Remove all commas
                .replace(/[,]/g, '')
                //Used for supporting strings such as '30 Years, 2 Hours'
                .replace(/([\d])\s([\w])/gi, '$1$2')
                //Split array to number-type combinations
                .split(' ');

            var errors = splitted.some(function(v) {
                return v.match(matchPattern) === null;
            });

            if (errors) {
                throw new Error('Invalid format');
            }

            var seconds = splitted
                .filter(function(v) {
                    return v.match(matchPattern);
                })
                .map(function(v) {
                    var numeric = v.match(/[\d]+/)[0];
                    return [parseInt(v.substr(0, numeric.length)), v.substr(numeric.length).toLowerCase()];
                })
                .map(function(v) {
                    return v[0] * units[v[1]];
                })
                .reduce(function(prev, curr) {
                    return prev + curr;
                }, 0);

            if (isNaN(seconds)) {
                throw new Error('Invalid format');
            }

            return new TimeSpan(seconds);
        }

        //Constructors
        toTime.fromMilliseconds = function(milliseconds) {
            return new TimeSpan(milliseconds * SECONDS_IN_MILLISECOND);
        };

        toTime.fromSeconds = function(seconds) {
            return new TimeSpan(seconds);
        };

        toTime.fromMinutes = function(minutes) {
            return new TimeSpan(minutes * SECONDS_IN_MINUTE);
        };

        toTime.fromHours = function(hours) {
            return new TimeSpan(hours * SECONDS_IN_HOUR);
        };

        toTime.fromDays = function(days) {
            return new TimeSpan(days * SECONDS_IN_DAY);
        };

        toTime.fromYears = function(years) {
            return new TimeSpan(years * SECONDS_IN_YEAR);
        };

        return toTime;
    }());

    // Code below was taken from underscore sourcecode
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;

    // Export the library for NodeJS, with backward compatability
    // Export code was taken from Underscore sourcecode
    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = toTime;
        }
        exports._ = toTime;
    } else {
        root._ = toTime;
    }

}());