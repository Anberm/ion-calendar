import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { CalendarModule } from 'projects/ion-calendar/public-api';
import { DemosModule } from '../demos/demos.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    DemosModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
