import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {

  public activeLang = 'en';
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang(this.activeLang);
  }

  public cambiarLenguaje(lang) {
    this.activeLang = lang;
    this.translateService.use(lang);
  }
}
