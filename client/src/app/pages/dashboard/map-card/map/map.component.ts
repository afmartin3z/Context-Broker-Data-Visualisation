import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import * as L from 'leaflet';

import { NbThemeService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-map',
  styleUrls: ['./map.component.scss'],
  template: `
    <div leaflet [leafletOptions]="options" [leafletLayers]="layers" (leafletMapReady)="mapReady($event)"></div>
  `,
})
export class MapComponent implements OnDestroy {

  @Output() select: EventEmitter<any> = new EventEmitter();

  layers = [];
  currentTheme: any;
  alive = true;

  options = {
    zoom: 11,
    zoomControl: false,
    center: L.latLng({ lat: 40.4167, lng: -3.70325 }),
    maxBounds: new L.LatLngBounds(
      new L.LatLng(-89.98155760646617, -180),
      new L.LatLng(89.99346179538875, 180),
    ),
    maxBoundsViscosity: 1.0,
  };

  constructor(private theme: NbThemeService) {

    combineLatest([
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([config]: [any]) => {
        this.currentTheme = config.variables.countryOrders;
      });
  }

  mapReady(map: L.Map) {

    map.addControl(L.control.zoom({ position: 'bottomright' }));
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(map);

    // fix the map fully displaying, existing leaflet bag
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
