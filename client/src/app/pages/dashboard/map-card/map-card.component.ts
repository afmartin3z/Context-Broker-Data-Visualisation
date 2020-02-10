import { Component, OnDestroy } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-map-card',
  styleUrls: ['./map-card.component.scss'],
  template: `
    <div>
      <app-map>
      </app-map>
    </div>
  `,
})
export class MapCardComponent implements OnDestroy {

  private alive = true;

  countryName = '';
  countryData: number[] = [];
  countriesCategories: string[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;

  constructor(private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
