import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { StatsDashboardRoutingModule } from './stats-dashboard-routing.module';
import { StatsDashboardComponent } from './stats-dashboard.component';
import { GraphicCardComponent } from '../shared/templates/graphic-card/graphic-card.component';

@NgModule({
  declarations: [
    StatsDashboardComponent,
    GraphicCardComponent,
  ],
  imports: [
    CommonModule,
    StatsDashboardRoutingModule,
    CardModule,
  ],
})
export class StatsDashboardModule { }
