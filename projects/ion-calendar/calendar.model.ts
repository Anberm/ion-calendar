import { AnimationBuilder } from '@ionic/core';

export type SelectMode = 'month' | 'quarter' | 'year' | undefined;

export interface ScheduleDay {
  id: string;
  day: string;
  date: Date | number;
  weekDes: string;
  isToday: boolean;
  scheduleData?: ScheduleData[];
}

export interface CalendarOriginal {
  time: number;
  date: Date;
  year: number;
  month: number;
  firstWeek: number;
  howManyDays: number;
}

export interface CalendarDay {
  time: number;
  isToday: boolean;
  selected: boolean;
  disable: boolean;
  cssClass: string;
  isLastMonth?: boolean;
  isNextMonth?: boolean;
  title?: string;
  subTitle?: string;
  isScheduled?: boolean;
  scheduleData?: ScheduleData[];
  marked?: boolean;
  style?: {
    title?: string;
    subTitle?: string;
  };
  isFirst?: boolean;
  isLast?: boolean;
}

export class CalendarMonth {
  original: CalendarOriginal;
  days: Array<CalendarDay | any>;
}

export class CalendarQuarter {
  original: CalendarOriginal;
  quarters: Array<number | any>;
}

export interface ScheduleData {
  time: Date;
  content: string;
  [key: string]: any;
}
export interface DayConfig {
  date: Date;
  marked?: boolean;
  disable?: boolean;
  title?: string;
  subTitle?: string;
  cssClass?: string;
  isScheduled?: boolean;
  scheduleData?: ScheduleData[];
}

export interface ModalOptions {
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface CalendarModalOptions extends CalendarOptions {
  autoDone?: boolean;
  format?: string;
  cssClass?: string;
  id?: string;
  isSaveHistory?: boolean;
  closeLabel?: string;
  doneLabel?: string;
  clearLabel?: string;
  closeIcon?: boolean;
  doneIcon?: boolean;
  canBackwardsSelected?: boolean;
  title?: string;
  defaultScrollTo?: Date;
  defaultDate?: DefaultDate;
  defaultDates?: DefaultDate[];
  defaultDateRange?: { from: DefaultDate; to?: DefaultDate } | null;
  step?: number;
  /**
   * @deprecated this version notwork
   */
  showYearPicker?: boolean;
  defaultEndDateToStartDate?: boolean;
}

export interface CalendarOptions {
  /**
   * 一周的第一天是周几，周一：0，周日：6
   */
  firstDay?: number;
  from?: Date | number;
  to?: Date | number;
  pickMode?: PickMode;
  weekStart?: number;
  disableWeeks?: Array<number>;
  weekdays?: Array<string>;
  monthFormat?: string;
  quarterFormat?: string;
  yearFormat?: string;
  color?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  daysConfig?: Array<DayConfig>;
  /**
   * show last month & next month days fill six weeks
   */
  showAdjacentMonthDay?: boolean;
}

export interface CalendarComponentOptions extends CalendarOptions {
  showToggleButtons?: boolean;
  showMonthPicker?: boolean;
  monthPickerFormat?: string[];
}

export class CalendarResult {
  time: number;
  unix: number;
  dateObj: Date;
  string: string;
  years: number;
  months: number;
  quarter: number;
  date: number;
}

export class CalendarComponentMonthChange {
  oldMonth: CalendarResult;
  newMonth: CalendarResult;
}

export class CalendarComponentQuarterChange {
  oldQuarter: CalendarResult;
  newQuarter: CalendarResult;
}

export class CalendarComponentYearChange {
  oldYear: CalendarResult;
  newYear: CalendarResult;
}

export type DefaultDate = Date | string | number | null;
export type Colors =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'light'
  | 'dark'
  | string;
export type PickMode = 'multi' | 'single' | 'range' | 'single-week';
export type CalendarComponentTypeProperty =
  | 'string'
  | 'js-date'
  | 'moment'
  | 'time'
  | 'object';
export type CalendarComponentPayloadTypes = string | Date | number | {};
