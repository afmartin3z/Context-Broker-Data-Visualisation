import { Injectable } from '@angular/core';
import { AirQualityObserved } from 'src/app/shared/models/fiware/air-quality-observed';
import { OffStreetParking } from 'src/app/shared/models/fiware/offStreetParking';
import { Entity } from 'src/app/shared/models/entity';

@Injectable({
    providedIn: 'root',
})
export class PopupService {

    public getPopup(modelKey: string, entity: any): string {
        switch (modelKey) {
            case 'AirQualityObserved': return this.getEntityPopup(entity);
            case 'OffStreetParking': return this.getEntityPopup(entity);
        }
    }

    private getEntityPopup(e: Entity): string {
        return e.id;
    }

    private getAirQualityObservedPopup(e: AirQualityObserved): string {
        return 'Air Quality Observed';
    }

    private getOffStreetParkingPopup(e: OffStreetParking): string {
        return 'Off Street Parking';
    }

}
