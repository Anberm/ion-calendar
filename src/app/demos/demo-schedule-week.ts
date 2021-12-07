import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions, CalendarDay, DayConfig } from 'projects/ion-calendar/public-api';
import * as moment from 'moment';
@Component({
  selector: 'demo-schedule-week',
  template: `
    <ion-calendar
      #calendar
      [ngModel]="date"
      (select)="onSelect($event)"
      [options]="options"
      type="js-date"
      format="YYYY-MM-DD"
    >
    </ion-calendar>
  `,
})
export class DemoScheduleWeekComponent {
  date: any;
  options: CalendarComponentOptions = {
    from: new Date(2000, 0, 1),
    pickMode: 'single-week',
    firstDay: 1,
  };

  constructor(public modalCtrl: ModalController) {
    moment.locale('zh-cn');
    const weekOfday = moment().weekday();
    this.date = {
      from: moment()
        .startOf('day')
        .subtract(weekOfday - (this.options.firstDay || 0), 'days'),
      to: moment()
        .startOf('day')
        .add(6 + (this.options.firstDay || 0) - weekOfday, 'days'),
    };
    const daysConfig: DayConfig[] = [
      //设置某天有排班
      {
        date: new Date(),
        isScheduled: true,
        scheduleData: [
          {
            content: '测试1',
            time: new Date(),
          },
          {
            content: '测试2',
            time: new Date(),
          },
          {
            content: '测试3',
            time: new Date(),
          },
          {
            content: '测试4',
            time: new Date(),
          },
        ],
      },
    ];

    this.options.daysConfig = daysConfig;
  }

  onSelect($event: CalendarDay) {
    const wd = moment($event.time).weekday();
    // this.date = {
    //   from: moment().subtract(wd, 'days'),
    //   to: moment().add(6 - wd, 'days'),
    // };
  }
}
