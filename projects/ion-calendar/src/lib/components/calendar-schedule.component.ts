import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ion-calendar-schedule',
  template: `
    <div class="calendar-schedule__title" *ngIf="showTitle">{{ title }}</div>
    <div class="calendar-schedule-list">
      <div class="calendar-schedule-list__item">
        <div class="schedule-list__title">
          <div class="schedule-list__title-day">17</div>
          <div class="schedule-list__title-week">周一</div>
        </div>
        <div class="schedule-list__content">
          <div class="schedule-list__content-scroll">
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
            <div class="schedule-list__item">
              <div class="schedule-list__item-content">测试</div>
              <div class="schedule-list__item-time">09:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./calendar-schedule.component.scss'],
})
export class CalendarScheduleComponent {
  @Input() showTitle = true;
  @Input() title = '日程';
  @Input() type: 'day' | 'month' = 'day';
  @Input() height: number | string | 'full';
  @Input() data: any[] = [];
  constructor() {}
}
