import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion-calendar';

@Component({
  selector: 'demo-schedule',
  template: `
    <hr />
    <h3 style="text-align: center;">schedule</h3>
    <ion-calendar
      [(ngModel)]="date"
      (onChange)="onChange($event)"
      [options]="options"
      type="js-date"
      format="YYYY-MM-DD"
    >
    </ion-calendar>
  `,
})
export class DemoScheduleComponent {
  date: Date = new Date();
  options: CalendarComponentOptions = {
    from: new Date(2000, 0, 1),
  };

  constructor(public modalCtrl: ModalController) {}

  onChange($event) {
    console.log($event);
  }
}
