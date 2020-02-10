import { Moment } from 'moment';

export interface Sensor {
  id: string;
  type: string;
  //   location: {
  //     coordinates: number[];
  //   };
  latitude: number;
  longitude: number;
  //   dateObserved: Date;
  TimeInstant: Moment;
  NO: string;
  NO2: string;
  //   NOx: string;
  O3: string;
  SO2: string;
  CO: string;
  C6H6: string;
  PM10: string;
  AQI: string;
  'PM2.5': string;
}
