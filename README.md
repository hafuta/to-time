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


#### To Do
- [ ]  Add support for decimal numbers in textual representation
- [ ]  Add more tests
- [ ]  Improve documentation
- [ ]  Integrate with Travis


