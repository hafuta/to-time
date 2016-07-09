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

    var ToTime = function ToTime() {
        function ToTime(seconds) {
            this.val = seconds;
        }

        //Converters
        ToTime.prototype.ms = ToTime.prototype.milliseconds = function ms() {
            return this.val * MILLISECONDS_IN_SECOND;
        };

        ToTime.prototype.seconds = ToTime.prototype.second = function seconds() {
            return this.val;
        };

        ToTime.prototype.minutes = ToTime.prototype.minute = function minutes() {
            return this.val / SECONDS_IN_MINUTE;
        };

        ToTime.prototype.hours = ToTime.prototype.hour = function hours() {
            return this.val / SECONDS_IN_HOUR;
        };

        ToTime.prototype.days = ToTime.prototype.day = function days() {
            return this.val / SECONDS_IN_DAY;
        };

        ToTime.prototype.years = ToTime.prototype.year = function years() {
            return this.val / SECONDS_IN_YEAR;
        };

        //Appenders
        ToTime.prototype.addSeconds = function(seconds) {
            this.val += seconds;
            return this;
        };

        ToTime.prototype.addMinutes = function(minutes) {
            this.val += minutes * SECONDS_IN_MINUTE;
            return this;
        };

        ToTime.prototype.addHours = function(hours) {
            this.val += hours * SECONDS_IN_HOUR;
            return this;
        };

        ToTime.prototype.addDays = function(days) {
            this.val += days * SECONDS_IN_DAY;
            return this;
        };

        ToTime.prototype.addYears = function(years) {
            this.val += years * SECONDS_IN_YEAR;
            return this;
        };

        ToTime.prototype.addMilliseconds = function(milliseconds) {
            this.val += milliseconds * SECONDS_IN_MILLISECOND;
            return this;
        };

        //Constructors
        ToTime.fromMilliseconds = function(milliseconds) {
            return new ToTime(milliseconds * SECONDS_IN_MILLISECOND);
        };

        ToTime.fromSeconds = function(seconds) {
            return new ToTime(seconds);
        };

        ToTime.fromMinutes = function(minutes) {
            return new ToTime(minutes * SECONDS_IN_MINUTE);
        };

        ToTime.fromHours = function(hours) {
            return new ToTime(hours * SECONDS_IN_HOUR);
        };

        ToTime.fromDays = function(days) {
            return new ToTime(days * SECONDS_IN_DAY);
        };

        ToTime.fromYears = function(years) {
            return new ToTime(years * SECONDS_IN_YEAR);
        };

        //Formaters
        ToTime.prototype.humanize = function humanize() {
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

        ToTime.prototype.toString = function toString() {
            return this.humanize(false);
        };

        return ToTime;
    }();

    String.prototype.__defineGetter__('toTime', function() {

        var units = {};
        units.y = units.year = units.years = SECONDS_IN_YEAR;
        units.d = units.day = units.days = SECONDS_IN_DAY;
        units.h = units.hour = units.hours = SECONDS_IN_HOUR;
        units.m = units.minute = units.minutes = SECONDS_IN_MINUTE;
        units.s = units.second = units.seconds = ONE_SECOND;
        units.ms = units.millisecond = units.milliseconds = SECONDS_IN_MILLISECOND;

        var matchPattern = /^[\d]+[\w]+$/;

        var splitted = this.toLowerCase()
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

        return new ToTime(seconds);
    });

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
            exports = module.exports = ToTime;
        }
        exports._ = ToTime;
    } else {
        root._ = ToTime;
    }

}());