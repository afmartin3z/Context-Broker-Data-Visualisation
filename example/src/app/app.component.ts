import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import * as L from 'leaflet';
// import * as LMC from 'leaflet.markercluster';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
declare let L;
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js';
import * as moment from 'moment';
import { Sensor } from './sensor.model.js';
import { Historic, Sample } from './historic.model.js';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {


  // @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('myChart', { static: false }) private chartRef;

  canvas: any;
  ctx: any;

  title = 'test1';

  map;

  chart;

  realTimeData: string[] = ['This is the real-time data container'];

  customIcon = L.icon({
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  markers;

  constructor(private http: HttpClient) {

  }

  getData() {

    let heads = new HttpHeaders();
    heads = heads.set('fiware-service', 'openiot');
    heads = heads.set('fiware-servicepath', '/EEA_POLLUTION');
    // heads = heads.set('fiware-service', 'environment');
    // heads = heads.set('fiware-servicepath', '/Madrid');
    let pams = new HttpParams();
    pams = pams.set('type', 'EEA_POLLUTION');
    // pams = pams.set('type', 'AirQualityObserved');
    pams = pams.set('options', 'keyValues');
    pams = pams.set('limit', '500');

    this.http.get('/broker/v2/entities', { headers: heads, params: pams }).subscribe((sensor: Sensor[]) => {
      this.markers = L.markerClusterGroup();
      sensor.forEach(s => {
        const coordinates: number[] = [s.latitude, s.longitude];
        const marker = L.marker(coordinates, {
          icon: this.customIcon,
          clickable: true
        }).on('click', (event) => {
          console.log(coordinates);
          this.realTimeData = ['Latitude: ' + s.latitude,
          '\nLongitude: ' + s.longitude,
          '\nDate: ' + moment(s.TimeInstant).format('MMMM Do YYYY, h:mm:ss a'),
          '\nNO: ' + s.NO,
          '\nNO2: ' + s.NO2,
          '\nO3: ' + s.O3];
          this.getHistoric(s);
        });
        this.markers.addLayer(marker);
        marker.bindPopup('Latitude: ' + s.latitude +
          '<br />Longitude: ' + s.longitude +
          '<br />Date: ' + moment(s.TimeInstant).format('MMMM Do YYYY, h:mm:ss a')
        );
      });
      this.map.addLayer(this.markers);
    });
  }

  ngAfterViewInit(): void {
    console.log('holi');
    this.map = L.map('map', {
      center: [40.4167, -3.70325],
      zoom: 11
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.map.on('zoom', this.onMapReset.bind(this));

    this.map.on('click', this.onMapClick);

    this.getData();

    // this.showChart();
  }

  getHistoric(data: Sensor) {
    console.log(data);
    let heads = new HttpHeaders();
    heads = heads.set('fiware-service', 'openiot');
    heads = heads.set('fiware-servicepath', '/EEA_POLLUTION');
    this.http.get('/historic/STH/v1/contextEntities/type/EEA_POLLUTION/id/'
      + data.id + '/attributes/NO2?lastN=10', { headers: heads }).subscribe((res: Historic) => {
        console.log(res);
        console.log(res.contextResponses[0].contextElement.attributes[0].values);
        let historic = res.contextResponses[0].contextElement.attributes[0].values;
        let labels = historic.map((d: Sample) => moment(d.recvTime).format('h:mm:ss'));
        let values = historic.map((d: Sample) => d.attrValue);
        this.showChart(labels, values, [20, 30, 11]);
      });
  }

  onMapClick() {
    console.log('click');
  }

  onMapReset() {
    if (this.map.getZoom() < 6) {
      console.log(this.markers);
      // this.markers.remove();
    }
  }

  showChart(ls, vs, vsNo) {

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ls,
        datasets: [{
          label: 'NO2',
          data: vs,
          backgroundColor: 'lightblue',
          borderColor: 'lightblue',
          fill: false
        },
        {
          label: 'NO',
          data: vsNo,
          backgroundColor: 'lightgreen',
          borderColor: 'lightgreen',
          fill: false
        }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }

}
