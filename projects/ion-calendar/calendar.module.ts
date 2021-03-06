import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CalendarController } from './calendar.controller';
import { CalendarModalOptions } from './calendar.model';
import { CalendarScheduleComponent } from './components/calendar-schedule.component';
import { CalendarWeekComponent } from './components/calendar-week.component';
import { CalendarComponent } from './components/calendar.component';
import { CalendarModal } from './components/calendar.modal';
import { MonthPickerComponent } from './components/month-picker.component';
import { MonthComponent } from './components/month.component';
import { QuarterPickerComponent } from './components/quarter-picker.component';
import { TimePipe } from './components/time.pipe';
import { DEFAULT_CALENDAR_OPTIONS } from './services/calendar-options.provider';
import { CalendarService } from './services/calendar.service';

export function calendarController(
  modalCtrl: ModalController,
  calSvc: CalendarService
) {
  return new CalendarController(modalCtrl, calSvc);
}

export const CALENDAR_COMPONENTS = [
  CalendarModal,
  CalendarWeekComponent,
  MonthComponent,
  CalendarComponent,
  MonthPickerComponent,
  QuarterPickerComponent,
  CalendarScheduleComponent,
];

export const CALENDAR_PIPES = [TimePipe];

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [...CALENDAR_COMPONENTS, ...CALENDAR_PIPES],
  exports: [...CALENDAR_COMPONENTS, ...CALENDAR_PIPES],
  entryComponents: CALENDAR_COMPONENTS,
  providers: [
    CalendarService,
    {
      provide: CalendarController,
      useFactory: calendarController,
      deps: [ModalController, CalendarService],
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarModule {
  static forRoot(
    defaultOptions: CalendarModalOptions = {}
  ): ModuleWithProviders<CalendarModule> {
    return {
      ngModule: CalendarModule,
      providers: [
        { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions },
      ],
    };
  }
}
