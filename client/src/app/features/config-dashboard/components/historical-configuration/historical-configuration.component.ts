import { Component, Input, ViewChild } from '@angular/core';
import { ConfigDashboardService } from '../../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ContextBrokerForm } from '../../models/context-broker-form';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { InputWithValidationComponent } from 'src/app/shared/templates/input-with-validation/input-with-validation.component';

@Component({
    selector: 'app-historical-configuration',
    templateUrl: './historical-configuration.component.html',
    styleUrls: ['./historical-configuration.component.scss'],
})
export class HistoricalConfigurationComponent extends BaseComponent {

    @Input() public cb: ContextBrokerForm;

    @ViewChild('cygnusInput', { static: false }) private cygnusInput: InputWithValidationComponent;
    @ViewChild('cometInput', { static: false }) private cometInput: InputWithValidationComponent;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private appMessageService: AppMessageService,
    ) {
        super();
    }

    protected onCheckCygnus(): void {
        const url: string = this.cb.historicalForm.value.cygnus;

        this.configDashboardService.checkCygnusHealth(url).pipe(takeUntil(this.destroy$)).subscribe(
            isLive => {
                isLive ? this.onCheckCygnusSuccess() : this.onCheckCygnusFail();
            },
            err => {
                this.onCheckCygnusFail();
            });
    }

    protected onCheckComet(): void {
        const url: string = this.cb.historicalForm.value.comet;

        this.configDashboardService.checkCometHealth(url).pipe(takeUntil(this.destroy$)).subscribe(
            isLive => {
                isLive ? this.onCheckCometSuccess() : this.onCheckCometFail();
            },
            err => {
                this.onCheckCometFail();
            });
    }

    private onCheckCygnusSuccess(): void {
        this.cygnusInput.showInfo();
    }

    private onCheckCygnusFail(): void {
        this.cygnusInput.showWarning();
    }

    private onCheckCometSuccess(): void {
        this.cometInput.showInfo();
    }

    private onCheckCometFail(): void {
        this.cometInput.showWarning();
    }

}
