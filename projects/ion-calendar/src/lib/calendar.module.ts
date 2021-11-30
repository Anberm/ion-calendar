import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CalendarController } from './calendar.controller';
import { CalendarModalOptions } from './calendar.model';
import { CALENDAR_COMPONENTS } from './components';
import { DEFAULT_CALENDAR_OPTIONS } from './services/calendar-options.provider';
import { CalendarService } from './services/calendar.service';


export function calendarController(modalCtrl: ModalController, calSvc: CalendarService) {
  return new CalendarController(modalCtrl, calSvc);
}

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: CALENDAR_COMPONENTS,
  exports: CALENDAR_COMPONENTS,
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
  static forRoot(defaultOptions: CalendarModalOptions = {}): ModuleWithProviders<CalendarModule> {
    return {
      ngModule: CalendarModule,
      providers: [
        { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions }
      ]
    };
  }
}
