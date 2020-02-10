import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'angular2-chartjs';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CountryOrdersComponent } from '../e-commerce/country-orders/country-orders.component';
import { CountryOrdersMapComponent } from '../e-commerce/country-orders/map/country-orders-map.component';
import { CountryOrdersChartComponent } from '../e-commerce/country-orders/chart/country-orders-chart.component';
import { CountryOrdersMapService } from '../e-commerce/country-orders/map/country-orders-map.service';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbListModule,
    ChartModule,
    NbProgressBarModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
  ],
  declarations: [
    DashboardComponent,
    CountryOrdersComponent,
    CountryOrdersMapComponent,
    CountryOrdersChartComponent,
  ],
  providers: [
    CountryOrdersMapService,
  ],
})
export class DashboardModule { }
