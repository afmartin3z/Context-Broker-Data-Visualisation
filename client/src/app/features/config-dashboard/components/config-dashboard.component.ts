import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from 'src/app/shared/misc/base.component';
import { ConfigDashboardService } from '../services/config-dashboard-service/config-dashboard.service';
import { takeUntil } from 'rxjs/operators';
import { ContextBrokerForm, ServiceForm } from '../models/context-broker-form';
import { ContextBrokerConfiguration, ServiceConfiguration } from '../models/context-broker-configuration';
import { LayerService } from '../../map-dashboard/services/layer-service/layer-service';
import { AppMessageService } from 'src/app/shared/services/app-message-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { ServiceConfigurationComponent } from './service-configuration/service-configuration.component';
import { AccordionTab } from 'primeng/accordion/accordion';

@Component({
    selector: 'app-config-dashboard',
    templateUrl: './config-dashboard.component.html',
    styleUrls: ['./config-dashboard.component.scss'],
})
export class ConfigDashboardComponent extends BaseComponent implements OnInit {

    protected configurationLoaded: boolean = false;
    protected addedContextBrokerAtLeastOnce: boolean = false;
    protected removedContextBrokerAtLeastOnce: boolean = false;
    protected removedServiceAtLeastOnce: boolean = false;
    protected selectedEntitiesChange: boolean = false;
    protected accordionTabsSelected: boolean = false;
    protected contextBrokers: ContextBrokerForm[] = [];


    @ViewChild('serviceConfiguration', { static: false }) private serviceConfiguration: ServiceConfigurationComponent;
    @ViewChildren('accordionTab') private accordionTabs: QueryList<AccordionTab>;

    constructor(
        private configDashboardService: ConfigDashboardService,
        private appMessageService: AppMessageService,
        private layerService: LayerService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.configDashboardService.getConfiguration().pipe(takeUntil(this.destroy$)).subscribe(
            contextBrokers => {
                if (contextBrokers.length === 0) {
                    this.onAddContextBroker();
                    this.configurationLoaded = true;
                } else {
                    this.loadConfiguration(contextBrokers);
                    this.configurationLoaded = true;
                }
            },
            err => {
                this.appMessageService.add({ severity: 'error', summary: 'Cannot load the configuration' });
            },
        );
    }

    protected shouldApplyButtonBeDisplayed(): boolean {
        return this.configurationLoaded
            && (this.contextBrokers.length > 0 || this.addedContextBrokerAtLeastOnce || this.removedContextBrokerAtLeastOnce);
    }

    protected shouldApplyButtonBeEnabled(): boolean {
        return this.shouldApplyButtonBeDisplayed() && this.isDirtyConfiguration() && this.isValidConfiguration();
    }

    protected shouldAdvertisementBeDisplayed(): boolean {
        return this.shouldApplyButtonBeEnabled();
    }

    protected onAddContextBroker(): void {
        this.accordionTabsSelected = true;
        if (this.accordionTabs && this.accordionTabs.length > 0) {
            this.accordionTabs.forEach(a => a.selected = false);
        }
        this.addedContextBrokerAtLeastOnce = true;
        this.contextBrokers.push({
            header: this.configDashboardService.defaultContextName,
            form: this.configDashboardService.createContextBrokerForm(),
            historicalForm: this.configDashboardService.createHistoricalForm(),
            services: [],
            entities: [],
            selectedEntities: [],
        });
    }

    protected onRemoveService(): void {
        this.removedServiceAtLeastOnce = true;
    }

    protected onSelectedEntitiesChange(): void {
        this.selectedEntitiesChange = true;
    }

    protected onRemoveContextBroker(index: number): void {
        this.confirmationService.confirm({
            icon: 'pi pi-info',
            header: 'Are you sure you want to delete this Context Broker?',
            message: 'The configuration of the Context Broker "' + this.contextBrokers[index].header + '" will be deleted. ' +
                'Note that this change will only be confirmed when applying the configuration.',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: (): void => {
                this.removeContextBroker(index);
            },
        });
    }

    protected onApplyConfiguration(): void {
        if (this.checkEntities()) {
            this.applyConfiguration();
        }
    }

    protected onUrlChange(): void {
        if (this.serviceConfiguration) {
            this.serviceConfiguration.onContextBrokerUrlChange();
        }
    }

    private checkEntities(): boolean {
        let valid: boolean = true;
        this.contextBrokers.forEach(cb => {
            if (cb.services.length === 0) {
                if (cb.selectedEntities.length === 0) {
                    valid = false;
                }
            } else {
                cb.services.forEach(s => {
                    if (s.selectedEntities.length === 0) {
                        valid = false;
                    }
                });
            }
        });
        if (!valid) {
            this.appMessageService.add({
                severity: 'error', summary: 'Cannot apply the configuration',
                detail: 'There is at least one context broker or one service with no selected entities',
            });
        }
        return valid;
    }

    private applyConfiguration(): void {
        const config: ContextBrokerConfiguration[] = this.getContextBrokers();
        this.configDashboardService.postConfiguration(config).pipe(takeUntil(this.destroy$)).subscribe(
            res => {
                this.onApplyConfigurationSuccess();
            },
            err => {
                this.onApplyConfigurationFail();
            });
    }

    private onApplyConfigurationSuccess(): void {
        this.appMessageService.add({ severity: 'success', summary: 'Configuration applied' });
        this.router.navigate(['/map-dashboard']);
    }

    private onApplyConfigurationFail(): void {
        this.appMessageService.add({ severity: 'error', summary: 'Cannot apply the configuration' });
    }

    private markFormsAsPristine(): void {
        this.addedContextBrokerAtLeastOnce = false;
        this.removedContextBrokerAtLeastOnce = false;
        this.removedServiceAtLeastOnce = false;
        this.selectedEntitiesChange = false;
        this.contextBrokers.forEach(cb => {
            cb.form.markAsPristine();
            cb.historicalForm.markAsPristine();
            cb.services.forEach(s => s.form.markAsPristine());
        });
    }

    private isDirtyConfiguration(): boolean {
        return this.contextBrokers.some(cb => {
            return cb.form.dirty ||
                (cb.form.get('needHistoricalData').value && cb.historicalForm.dirty) ||
                (cb.form.get('needServices').value && cb.services.some(s => s.form.dirty));
        }) || this.removedContextBrokerAtLeastOnce || this.removedServiceAtLeastOnce || this.selectedEntitiesChange;
    }

    private isValidConfiguration(): boolean {
        return this.contextBrokers.every(cb => {
            return cb.form.valid &&
                (!cb.form.get('needHistoricalData').value || cb.historicalForm.valid) &&
                (!cb.form.get('needServices').value || (cb.services.length > 0 && cb.services.every(s => s.form.valid)));
        });
    }

    private removeContextBroker(index: number): void {
        this.removedContextBrokerAtLeastOnce = true;
        this.contextBrokers.splice(index, 1);
    }

    private getContextBrokers(): ContextBrokerConfiguration[] {
        return this.contextBrokers.map(cb => {
            const needServicesBool: boolean = cb.form.get('needServices').value;
            const needHistoricalDataBool: boolean = cb.form.get('needHistoricalData').value;
            return {
                name: cb.form.get('name').value,
                url: cb.form.get('url').value,
                needServices: needServicesBool,
                needHistoricalData: needHistoricalDataBool,
                cygnus: needHistoricalDataBool ? cb.historicalForm.get('cygnus').value : '',
                comet: needHistoricalDataBool ? cb.historicalForm.get('comet').value : '',
                entities: this.layerService.treeNodesToEntitiesConfiguration(cb.entities, cb.selectedEntities),
                services: needServicesBool ? this.getServices(cb) : [],
            };
        });
    }

    private getServices(cb: ContextBrokerForm): ServiceConfiguration[] {
        return cb.services.map(s => {
            return {
                service: s.form.get('service').value,
                servicePath: s.form.get('servicePath').value,
                entities: this.layerService.treeNodesToEntitiesConfiguration(s.entities, s.selectedEntities),
            };
        });
    }

    private loadConfiguration(contextBrokers: ContextBrokerConfiguration[]): void {
        contextBrokers.forEach(cb => {
            const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(cb.entities);
            this.contextBrokers.unshift({
                header: cb.name,
                form: this.configDashboardService.createContextBrokerFormFromConfig(cb),
                historicalForm: this.configDashboardService.createHistoricalFormFromConfig(cb),
                services: this.loadServiceConfiguration(cb),
                entities: treeNodes,
                selectedEntities: selectedTreeNodes,
            });
        });
        setTimeout(() => {
            if (this.accordionTabs && this.accordionTabs.length > 0) {
                this.accordionTabs.forEach(a => a.selected = false);
            }
        });
    }

    private loadServiceConfiguration(cb: ContextBrokerConfiguration): ServiceForm[] {
        return cb.services.map(s => {
            const { treeNodes, selectedTreeNodes }: any = this.layerService.entitiesConfigurationToTreeNodes(s.entities);
            return {
                header: s.service + s.servicePath,
                form: this.configDashboardService.createServiceFormFromConfig(s),
                entities: treeNodes,
                selectedEntities: selectedTreeNodes,
            };
        });
    }

}
