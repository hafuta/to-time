[![Build Status](https://travis-ci.org/hafuta/to-time.svg?branch=master)](https://travis-ci.org/hafuta/to-time)

# to-time
Utility for converting textual time periods to time units

In development


#### Usage
###### Converting from textual time period to time units

```javascript
toTime('1 hour').seconds(); //3600
//same as:
toTime('1h').seconds(); //3600

toTime('1 Year 365 Days 4 Hours').hours(); //17524
//same as:
toTime('1y 365d 4h').hours(); //17524
```

Useful for usage in methods such as setInterval and setTimeout which consume the intervals in milliseconds
```javascript
//Instead of using 43200000 milliseconds (equivalent to 12 hours) we can do the following
setInterval(() => {
  //Do something here
}, toTime('12h').ms());

//Instead of using 5400000 milliseconds (equivalent to 1.5 hour)
setTimeout(() => {
  //Do something here
}, toTime.addHours(1.5).ms());
```

###### Allowed suffixes (all case insensetive)

* Year, Years, Y
* Week, Weeks, W
* Day, Days, D
* Hour, Hours, H
* Minute, Minutes, M
* Second, Seconds, S
* Millisecond, Milliseconds, MS


###### Initializing using factory methods
```javascript
toTime.fromHours(4).addMinutes(30).hours(); //4.5
toTime.fromYears(4).addWeeks(4).days(); //1488
```

###### Appenders methods
* addMilliseconds
* addSeconds
* addMinutes
* addHours
* addDays
* addWeeks
* addYears

###### Getters methods
* milliseconds : Number
* ms (alias to milliseconds)
* minutes : Number
* hours : Number
* days : Number
* weeks : Number
* years : Number
* humanize : String

#### Developing

##### Running tests

* Make sure to write tests, run new & existing tests using:
  ```shell
  npm run test
  ```
  
* Check for source code & tests code styling by running eslint:
  ```shell
  npm run lint
  ```

* If tests are passing and eslint doesn't return any error -> Create pull request

#### To Do
- [ ]  Add support for decimal numbers in textual representation
- [ ]  Add Karma for testing in browser environment (Currently testing server side using Mocha)
- [ ]  Add more tests
- [ ]  Improve documentation
- [ ]  Integrate with Travis


