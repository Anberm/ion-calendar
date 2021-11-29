import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from 'ion-calendar';

@Component({
  selector: 'demo-schedule',
  template: `
    <ion-calendar
      [(ngModel)]="date"
      (select)="onSelect($event)"
      [options]="options"
      type="js-date"
      format="YYYY-MM-DD"
    >
    </ion-calendar>
    <ion-calendar-schedule></ion-calendar-schedule>
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
      },
    ];

    this.options.daysConfig = daysConfig;
  }

  onSelect($event) {
    console.log($event);
  }
}
