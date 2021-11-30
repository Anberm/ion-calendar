import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarDay, ScheduleData, ScheduleDay } from '../calendar.model';
import { ScrollService } from '../services/scroll.service';
import { CalendarComponent } from './calendar.component';

@Component({
  selector: 'ion-calendar-schedule',
  template: `
    <div class="calendar-schedule__title" *ngIf="showTitle">{{ title }}</div>
    <div class="calendar-schedule-list" [id]="cId">
      <div
        class="calendar-schedule-list__item"
        *ngFor="let item of days"
        [id]="item.id"
      >
        <div class="schedule-list__title" [ngClass]="{ today: item.isToday }">
          <div class="schedule-list__title-day">{{ item.day }}</div>
          <div class="schedule-list__title-week">{{ item.weekDes }}</div>
        </div>
        <div class="schedule-list__content">
          <div class="schedule-list__content-scroll">
            <div
              class="schedule-list__item"
              *ngFor="let sitem of item.scheduleData"
            >
              <div class="schedule-list__item-content">
                {{ sitem.content }}
              </div>
              <div class="schedule-list__item-time">
                {{ sitem.time | _ctime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./calendar-schedule.component.scss'],
  providers: [ScrollService],
})
export class CalendarScheduleComponent implements OnDestroy, AfterViewInit {
  private isInit = false;
  private unsubscribe$ = new Subject<void>();

  cId = `clt-${guid()}`;

  private _calendar?: CalendarComponent;
  @Input() showTitle = true;
  @Input() title = '日程';
  @Input() topOffset = 470;

  @Input() data: any[] = [];

  days: ScheduleDay[] = [];

  @Input()
  set calendar(val: CalendarComponent) {
    this._calendar = val;
    if (this._calendar) {
      this._calendar.select
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.scrollToDay(res);
        });
      this._calendar.monthChange
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res) => {
          this.genDays();
          this.scrollToDay();
        });
      this.genDays();
      this.scrollToDay();
    }
  }
  private _getDoc(): Document {
    return this._doc || document;
  }
  constructor(
    private scrollSrv: ScrollService,
    @Inject(DOCUMENT) private _doc: any
  ) {}
  ngAfterViewInit(): void {
    this.isInit = true;
    setTimeout(() => {
      this.scrollToDay();
    }, 200);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  genDays(): void {
    const weeks = moment.weekdaysShort();
    let wi = 0;
    const tDays: ScheduleDay[] = [];
    this._calendar.monthOpt.days.forEach((c) => {
      if (wi === 6) {
        wi = 0;
      }
      if (c) {
        tDays.push({
          id: guid(),
          day: c.title,
          date: c.time,
          weekDes: weeks[wi],
          isToday: c.isToday,
          scheduleData: c.scheduleData,
        });
        wi++;
      }
    });
    this.days = tDays;
  }

  scrollToDay(tgDay?: CalendarDay): void {
    if (this.days.length == 0) {
      return;
    }
    if (!this.isInit) {
      return;
    }
    const container = this._getDoc().getElementById(this.cId);
    let tDay = tgDay ? moment(tgDay.time) : moment();

    const fDay = this.days.find((d) => tDay.isSame(d.date, 'days'));

    if (fDay) {
      const el = this._getDoc().getElementById(fDay.id);
      this.scrollSrv.scrollToElement(container, el, this.topOffset);
    } else {
      const el = this._getDoc().getElementById(this.days[0].id);

      this.scrollSrv.scrollToElement(container, el, this.topOffset);
    }
  }
}
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
