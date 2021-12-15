import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Provider,
} from '@angular/core';

import {
  CalendarMonth,
  CalendarModalOptions,
  CalendarComponentOptions,
  CalendarDay,
  CalendarComponentPayloadTypes,
  CalendarComponentMonthChange,
  CalendarComponentTypeProperty,
  SelectMode,
  CalendarComponentQuarterChange,
  CalendarComponentYearChange,
} from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';
import { defaults, pickModes } from '../config';
import { isIonIconsV4 } from '../utils/icons';

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true,
};

interface CompatibleIcons {
  caretDown: string;
  caretUp: string;
  chevronBack: string;
  chevronForward: string;
}

@Component({
  selector: 'ion-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR],
  styleUrls: ['./calendar.component.scss'],
  template: `
    <div class="title">
      <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title">
        <ion-button
          type="button"
          fill="clear"
          class="switch-btn"
          [attr.aria-label]="
            getDate(monthOpt.original.time) | date: MONTH_DATE_FORMAT
          "
          (click)="switchView()"
        >
          {{ _monthFormat(monthOpt.original.time) }}
          <ion-icon
            *ngIf="mode !== 'year'"
            class="arrow-dropdown"
            [name]="
              _view === 'days'
                ? _compatibleIcons.caretDown
                : _compatibleIcons.caretUp
            "
          ></ion-icon>
        </ion-button>
      </ng-template>
      <ng-template #title>
        <div
          class="switch-btn"
          [attr.aria-label]="
            getDate(monthOpt.original.time) | date: MONTH_DATE_FORMAT
          "
        >
          {{ _monthFormat(monthOpt.original.time) }}
        </div>
      </ng-template>
      <ng-template [ngIf]="_showToggleButtons">
        <ion-button
          type="button"
          fill="clear"
          class="back"
          [disabled]="!canBack()"
          (click)="prev()"
        >
          <ion-icon
            slot="icon-only"
            size="small"
            [name]="_compatibleIcons.chevronBack"
          ></ion-icon>
        </ion-button>
        <ion-button
          type="button"
          fill="clear"
          class="forward"
          [disabled]="!canNext()"
          (click)="next()"
        >
          <ion-icon
            slot="icon-only"
            size="small"
            [name]="_compatibleIcons.chevronForward"
          ></ion-icon>
        </ion-button>
      </ng-template>
    </div>
    <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
      <ion-calendar-week
        *ngIf="showDays"
        color="transparent"
        [weekArray]="_d.weekdays"
        [weekStart]="_d.weekStart"
      >
      </ion-calendar-week>

      <ion-calendar-month
        *ngIf="showDays"
        [opt]="_d"
        [componentMode]="true"
        [(ngModel)]="_calendarMonthValue"
        [month]="monthOpt"
        [readonly]="readonly"
        (change)="onChanged($event)"
        (swipe)="swipeEvent($event)"
        (select)="select.emit($event)"
        (selectStart)="selectStart.emit($event)"
        (selectEnd)="selectEnd.emit($event)"
        [pickMode]="_d.pickMode"
        [color]="_d.color"
      >
      </ion-calendar-month>
    </ng-template>

    <ng-template #monthPicker>
      <ion-calendar-month-picker
        *ngIf="!mode || mode == 'month'"
        [color]="_d.color"
        [monthFormat]="_options?.monthPickerFormat"
        (select)="monthOnSelect($event)"
        [month]="monthOpt"
      >
      </ion-calendar-month-picker>
      <ion-calendar-quarter-picker
        *ngIf="mode == 'quarter'"
        (select)="quarterOnSelect($event)"
      ></ion-calendar-quarter-picker>
    </ng-template>
  `,
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: 'month' | 'days' = 'days';
  _calendarMonthValue: CalendarDay[] = [null, null];
  _showToggleButtons = true;
  _compatibleIcons: CompatibleIcons;
  get showToggleButtons(): boolean {
    return this._showToggleButtons;
  }

  set showToggleButtons(value: boolean) {
    this._showToggleButtons = value;
  }

  _showMonthPicker = true;
  get showMonthPicker(): boolean {
    return this._showMonthPicker;
  }

  set showMonthPicker(value: boolean) {
    this._showMonthPicker = value;
  }

  monthOpt: CalendarMonth;
  _mode: SelectMode = undefined;
  @Input()
  set mode(val: SelectMode) {
    this._mode = val;
  }
  get mode() {
    return this._mode;
  }

  get showDays(): boolean {
    return (
      this.mode === 'day' || this.mode === 'week' || this.mode === undefined
    );
  }

  @Input()
  format: string = defaults.DATE_FORMAT;
  @Input()
  type: CalendarComponentTypeProperty = 'string';
  @Input()
  readonly = false;
  @Output()
  change: EventEmitter<CalendarComponentPayloadTypes> = new EventEmitter();
  @Output()
  yearChange: EventEmitter<CalendarComponentYearChange> = new EventEmitter();
  @Output()
  quarterChange: EventEmitter<CalendarComponentQuarterChange> = new EventEmitter();
  @Output()
  monthChange: EventEmitter<CalendarComponentMonthChange> = new EventEmitter();
  @Output()
  select: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  selectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output()
  selectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      this.monthOpt = this.createMonth(this.monthOpt.original.time);
    }
  }

  get options(): CalendarComponentOptions {
    return this._options;
  }

  readonly MONTH_DATE_FORMAT = 'MMMM yyyy';

  constructor(public calSvc: CalendarService) {
    if (isIonIconsV4()) {
      this._compatibleIcons = {
        caretDown: 'md-arrow-dropdown',
        caretUp: 'md-arrow-dropup',
        chevronBack: 'ios-arrow-back',
        chevronForward: 'ios-arrow-forward',
      };
    } else {
      this._compatibleIcons = {
        caretDown: 'caret-down-outline',
        caretUp: 'caret-up-outline',
        chevronBack: 'chevron-back-outline',
        chevronForward: 'chevron-forward-outline',
      };
    }
  }

  ngOnInit(): void {
    this.initOpt();
    this.monthOpt = this.createMonth(new Date().getTime());
  }

  getViewDate() {
    return this._handleType(this.monthOpt.original.time);
  }

  getDate(date: number) {
    return new Date(date);
  }

  setViewDate(value: CalendarComponentPayloadTypes) {
    this.monthOpt = this.createMonth(this._payloadToTimeNumber(value));
  }

  switchView(): void {
    this._view = this._view === 'days' ? 'month' : 'days';
  }

  prev(): void {
    if (
      this._view === 'days' &&
      this.mode != 'quarter' &&
      this.mode != 'year'
    ) {
      this.backMonth();
    } else {
      this.prevYear();
    }
  }

  next(): void {
    if (
      this._view === 'days' &&
      this.mode != 'quarter' &&
      this.mode != 'year'
    ) {
      this.nextMonth();
    } else {
      this.nextYear();
    }
  }

  prevYear(): void {
    if (moment(this.monthOpt.original.time).year() === 1970) {
      return;
    }
    const oldOpt = this.monthOpt;
    this.yearOnSelect(-1);
    if (this.mode == 'quarter') {
      this.quarterOnSelect(this._oldQuarter, oldOpt);
    } else if (this.mode == 'month') {
      this.monthOnSelect(this._oldMonth, oldOpt);
    }
  }

  nextYear(): void {
    const oldOpt = this.monthOpt;
    this.yearOnSelect(1);
    if (this.mode == 'quarter') {
      this.quarterOnSelect(this._oldQuarter, oldOpt);
    } else if (this.mode == 'month') {
      this.monthOnSelect(this._oldMonth, oldOpt);
    }
  }

  nextMonth(): void {
    const nextTime = moment(this.monthOpt.original.time)
      .add(1, 'months')
      .valueOf();
    const oldMontTime = this.monthOpt.original.time;

    this.monthOpt = this.createMonth(nextTime);
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(oldMontTime),
      newMonth: this.calSvc.multiFormat(nextTime),
    });
  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time < moment(this._d.to).valueOf();
  }

  backMonth(): void {
    const backTime = moment(this.monthOpt.original.time)
      .subtract(1, 'months')
      .valueOf();
    const oldMontTime = this.monthOpt.original.time;

    this.monthOpt = this.createMonth(backTime);
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(oldMontTime),
      newMonth: this.calSvc.multiFormat(backTime),
    });
  }

  canBack(): boolean {
    if (!this._d.from || this._view !== 'days') {
      return true;
    }
    return this.monthOpt.original.time > moment(this._d.from).valueOf();
  }

  yearOnSelect(addSub: number): void {
    const newYearTime = moment(this.monthOpt.original.time)
      .add(addSub, 'year')
      .valueOf();
    let oldYearTime = moment(this.monthOpt.original.time).valueOf();
    this.monthOpt = this.createMonth(newYearTime);
    if (this.mode == 'year') {
      this.yearChange.emit({
        oldYear: this.calSvc.multiFormat(oldYearTime),
        newYear: this.calSvc.multiFormat(newYearTime),
      });
    }
  }

  private _oldMonth;
  monthOnSelect(month?: number, oldOpt?: CalendarMonth): void {
    if (month == undefined) {
      month = moment(this.monthOpt.original.time).month();
    }
    this._view = 'days';
    const newMonth = moment(this.monthOpt.original.time).month(month).valueOf();
    const oldMontTime = oldOpt
      ? oldOpt.original.time
      : this.monthOpt.original.time;
    this._oldMonth = month;

    this.monthOpt = this.createMonth(newMonth);

    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(oldMontTime),
      newMonth: this.calSvc.multiFormat(newMonth),
    });
  }
  private _oldQuarter;
  quarterOnSelect(quarter?: number, oldOpt?: CalendarMonth): void {
    if (quarter == undefined) {
      quarter = moment(this.monthOpt.original.time).quarter();
    }
    this._view = 'days';
    const newQuarter = moment(this.monthOpt.original.time)
      .quarter(quarter)
      .valueOf();
    const oldQuarterTime = oldOpt
      ? oldOpt.original.time
      : this.monthOpt.original.time;

    this._oldQuarter = quarter;

    this.monthOpt = this.createMonth(newQuarter);

    this.quarterChange.emit({
      oldQuarter: this.calSvc.multiFormat(oldQuarterTime),
      newQuarter: this.calSvc.multiFormat(newQuarter),
    });
  }

  onChanged($event: CalendarDay[]): void {
    switch (this._d.pickMode) {
      case pickModes.SINGLE:
        const date = this._handleType($event[0].time);
        this._onChanged(date);
        this.change.emit(date);
        break;

      case pickModes.SINGLEWEEK:
        if ($event[0] && $event[1]) {
          const rangeDate = {
            from: this._handleType($event[0].time),
            to: this._handleType($event[1].time),
          };
          this._onChanged(rangeDate);
          this.change.emit(rangeDate);
        }
        break;

      case pickModes.RANGE:
        if ($event[0] && $event[1]) {
          const rangeDate = {
            from: this._handleType($event[0].time),
            to: this._handleType($event[1].time),
          };
          this._onChanged(rangeDate);
          this.change.emit(rangeDate);
        }
        break;

      case pickModes.MULTI:
        const dates = [];

        for (let i = 0; i < $event.length; i++) {
          if ($event[i] && $event[i].time) {
            dates.push(this._handleType($event[i].time));
          }
        }

        this._onChanged(dates);
        this.change.emit(dates);
        break;

      default:
    }
  }

  swipeEvent($event: any): void {
    const isNext = $event.deltaX < 0;
    if (isNext && this.canNext()) {
      this.nextMonth();
    } else if (!isNext && this.canBack()) {
      this.backMonth();
    }
  }

  _onChanged: Function = () => {};

  _onTouched: Function = () => {};

  _payloadToTimeNumber(value: CalendarComponentPayloadTypes): number {
    let date;
    if (this.type === 'string') {
      date = moment(value, this.format);
    } else {
      date = moment(value);
    }
    return date.valueOf();
  }

  _monthFormat(date: number): string {
    switch (this.mode) {
      case 'quarter':
        return moment(date).format(this._d.quarterFormat.replace(/y/g, 'Y'));
      case 'year':
        return moment(date).format(this._d.yearFormat.replace(/y/g, 'Y'));

      default:
        return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'));
    }
  }

  private initOpt(): void {
    if (this._options && typeof this._options.showToggleButtons === 'boolean') {
      this.showToggleButtons = this._options.showToggleButtons;
    }
    if (this._options && typeof this._options.showMonthPicker === 'boolean') {
      this.showMonthPicker = this._options.showMonthPicker;
      if (this._view !== 'days' && !this.showMonthPicker) {
        this._view = 'days';
      }
    }
    this._d = this.calSvc.safeOpt(this._options || {});
  }

  createMonth(date: number): CalendarMonth {
    return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
  }

  createQuarter(date: number): CalendarMonth {
    return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
  }

  _createCalendarDay(value: CalendarComponentPayloadTypes): CalendarDay {
    return this.calSvc.createCalendarDay(
      this._payloadToTimeNumber(value),
      this._d
    );
  }

  _handleType(value: number): CalendarComponentPayloadTypes {
    const date = moment(value);
    switch (this.type) {
      case 'string':
        return date.format(this.format);
      case 'js-date':
        return date.toDate();
      case 'moment':
        return date;
      case 'time':
        return date.valueOf();
      case 'object':
        return date.toObject();
    }
    return date;
  }

  writeValue(obj: any): void {
    this._writeValue(obj);
    if (obj) {
      if (this._calendarMonthValue[0]) {
        this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.monthOpt = this.createMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: () => {}): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  _writeValue(value: any): void {
    if (!value) {
      this._calendarMonthValue = [null, null];
      return;
    }

    switch (this._d.pickMode) {
      case 'single':
        this._calendarMonthValue[0] = this._createCalendarDay(value);
        break;
      case 'single-week':
        if (value.from) {
          this._calendarMonthValue[0] = value.from
            ? this._createCalendarDay(value.from)
            : null;
        }
        if (value.to) {
          this._calendarMonthValue[1] = value.to
            ? this._createCalendarDay(value.to)
            : null;
        }
        break;

      case 'range':
        if (value.from) {
          this._calendarMonthValue[0] = value.from
            ? this._createCalendarDay(value.from)
            : null;
        }
        if (value.to) {
          this._calendarMonthValue[1] = value.to
            ? this._createCalendarDay(value.to)
            : null;
        }
        break;

      case 'multi':
        if (Array.isArray(value)) {
          this._calendarMonthValue = value.map((e) => {
            return this._createCalendarDay(e);
          });
        } else {
          this._calendarMonthValue = [null, null];
        }
        break;

      default:
    }
  }
}
