import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-accordion-tab-header',
    templateUrl: './accordion-tab-header.component.html',
    styleUrls: ['./accordion-tab-header.component.scss'],
})
export class AccordionTabHeaderComponent {

    @Input() public header: string;
    @Input() public selected: boolean;
    @Input() public removable: boolean;
    @Output() public remove: EventEmitter<any> = new EventEmitter<any>();

    protected onRemove(event: any): void {
        event.stopPropagation();
        this.remove.emit(event);
    }

}
