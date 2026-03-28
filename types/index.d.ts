import type BigNumber from 'bignumber.js';

export class TimeFrame {
    val: BigNumber;
    ms(): number;
    milliseconds(): number;
    seconds(): number;
    second(): number;
    minutes(): number;
    minute(): number;
    hours(): number;
    hour(): number;
    days(): number;
    day(): number;
    weeks(): number;
    week(): number;
    years(): number;
    year(): number;
    addSeconds(seconds: number): this;
    addMinutes(minutes: number): this;
    addHours(hours: number): this;
    addDays(days: number): this;
    addWeeks(weeks: number): this;
    addYears(years: number): this;
    addMilliseconds(milliseconds: number): this;
    humanize(): string;
    toString(): string;
}

export interface ToTime {
    (text: string): TimeFrame;
    fromMilliseconds(milliseconds: number): TimeFrame;
    fromSeconds(seconds: number): TimeFrame;
    fromMinutes(minutes: number): TimeFrame;
    fromHours(hours: number): TimeFrame;
    fromDays(days: number): TimeFrame;
    fromWeeks(weeks: number): TimeFrame;
    fromYears(years: number): TimeFrame;
}

declare const toTime: ToTime;
export default toTime;
