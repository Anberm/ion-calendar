import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from 'projects/ion-calendar/public-api';

@Component({
  selector: 'demo-schedule',
  template: `
    <ion-calendar
      #calendar
      [(ngModel)]="date"
      (select)="onSelect($event)"
      [options]="options"
      type="js-date"
      format="YYYY-MM-DD"
    >
    </ion-calendar>
    <ion-calendar-schedule [calendar]="calendar"></ion-calendar-schedule>
  `,
})
export class DemoScheduleComponent {
  date: Date = new Date();

  options: CalendarComponentOptions = {
    from: new Date(2000, 0, 1),
  };

  constructor(public modalCtrl: ModalController) {
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

  onSelect($event) {
    console.log($event);
  }
}
