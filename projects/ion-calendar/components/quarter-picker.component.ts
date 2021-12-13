import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarQuarter } from '../calendar.model';
import { defaults } from '../config';
import * as moment from 'moment';

@Component({
  selector: 'ion-calendar-quarter-picker',
  styleUrls: ['./quarter-picker.component.scss'],
  template: `
    <div [class]="'quarter-picker ' + color">
      <div
        class="quarter-packer-item"
        [class.this-quarter]="
          i === _currentQuarter &&
          quarter.original.year === _thisQuarter.getFullYear()
        "
        *ngFor="let item of _quarterFormat; let i = index"
      >
        <button type="button" (click)="_onSelect(i+1)">{{ item }}</button>
      </div>
    </div>
  `,
})
export class QuarterPickerComponent {
  @Input()
  quarter: CalendarQuarter;
  @Input()
  color = defaults.COLOR;
  @Output()
  select: EventEmitter<number> = new EventEmitter();
  _thisQuarter = new Date();
  _currentQuarter = moment().quarter();
  _quarterFormat: string[] = [];
  constructor() {
    for (let index = 1; index <= moment().quarters(); index++) {
      this._quarterFormat.push(moment().quarter(index).format('第Q季度'));
    } 
    console.log(this._quarterFormat);
  }

  @Input()
  set quarterFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 4) {
      this._quarterFormat = value;
    }
  }

  get quarterFormat(): string[] {
    return this._quarterFormat;
  }
  _onSelect(quarter: number): void {
    this.select.emit(quarter);
  }

  getDate(quarter: number) {
    return moment().quarters(quarter).valueOf();
  }
}
