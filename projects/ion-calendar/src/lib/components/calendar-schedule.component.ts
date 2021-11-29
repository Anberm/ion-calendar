import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ion-calendar-schedule',
  template: `
    <ion-list>
      <ion-item>
        <div slot="start">
          <div>17</div>
          <div>周一</div>
        </div>
        <div>
          <div>
            <div>测试</div>
            <div>09:00</div>
          </div>
        </div>
      </ion-item>
    </ion-list>
  `,
 styleUrls: ['./calendar-schedule.component.scss'],
})
export class CalendarScheduleComponent {
  @Input() type:'day'|'month'='day'
  @Input() data: any[] = [];
  constructor() {}
}
