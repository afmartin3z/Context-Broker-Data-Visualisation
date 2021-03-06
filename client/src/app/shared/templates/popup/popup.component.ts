import { Component, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ScrollPanel } from 'primeng/scrollpanel/public_api';
import { Router } from '@angular/router';
import { ModelDto } from '../../models/model-dto';
import { EntityMetadataService } from '../../services/entity-metadata-service';
import { EntityMetadata } from '../../models/entity-metadata';
import { BaseComponent } from '../../misc/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent extends BaseComponent {

    @Input() public entity: any;
    @Input() public modelDto: ModelDto;
    protected attrs: any;
    private maxNumberChars: number = 35;
    @ViewChild('scrollPanel', { static: false }) private scrollPanel: ScrollPanel;

    constructor(
        private router: Router,
        private entityMetadataService: EntityMetadataService,
    ) {
        super();
    }

    public updatePopup(entity: any, modelDto: ModelDto): void {
        this.entity = entity;
        this.modelDto = modelDto;
        this.updateAttrs();
    }

    public refreshScroll(): void {
        if (this.scrollPanel) {
            this.scrollPanel.refresh();
        }
    }

    protected onClickStats(): void {
        this.entityMetadataService.setEntityMetadata(this.entity, this.modelDto).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.router.navigate(['/historical-data', this.modelDto.type, this.entity.id]);
        });
    }

    protected onClickDebug(): void {
        // TODO
    }

    private updateAttrs(): void {
        this.attrs = Object.entries(this.entity).filter(a => typeof a[1] !== 'object').map(a => [a[0], this.transformAttr(a[0], a[1])]);
    }

    private transformAttr(key: string, value: any): any {
        const dateExp: RegExp = new RegExp(/.*-.*-.*:.*:.*\..*Z/);
        if (dateExp.test(value)) {
            return moment(value).format('DD/MM/YYYY HH:mm:ss');
        }
        if (typeof value === 'string' && key.length + value.length > this.maxNumberChars) {
            return value.substring(0, this.maxNumberChars - key.length) + '...';
        }
        return value;
    }

}
