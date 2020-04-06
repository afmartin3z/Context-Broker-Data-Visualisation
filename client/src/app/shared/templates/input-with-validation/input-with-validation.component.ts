import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidatorService } from '../../services/validator-service';

@Component({
    selector: 'app-input-with-validation',
    templateUrl: './input-with-validation.component.html',
    styleUrls: ['./input-with-validation.component.scss'],
})
export class InputWithValidationComponent implements OnInit {

    @Input() public label: string;
    @Input() public controlName: string;
    @Input() public group: FormGroup;
    @Input() public required: boolean;
    @Input() public hasButton: boolean;
    @Input() public buttonIcon: string;
    @Output() public changeText: EventEmitter<any> = new EventEmitter<any>();
    @Output() public buttonClick: EventEmitter<any> = new EventEmitter<any>();

    private fControl: AbstractControl;
    private infoRequested: boolean;

    private requiredError: string = 'This field is mandatory';
    private emptySpacePatternError: string = this.requiredError;
    private pathPatternError: string = 'The path must start with "/"';

    constructor(private validatorService: ValidatorService) { }

    public ngOnInit(): void {
        this.fControl = this.group.get(this.controlName);
    }

    public showInfo(): void {
        this.infoRequested = true;
    }

    protected shouldErrorBeDisplayed(): boolean {
        return this.fControl.dirty && this.fControl.errors !== null;
    }

    protected shouldInfoBeDisplayed(): boolean {
        return this.infoRequested;
    }

    protected getErrorMessage(): string {
        if (this.fControl.hasError('required')) { return this.requiredError; }
        if (this.checkWhteSpacePattern()) { return this.emptySpacePatternError; }
        if (this.checkPathPattern()) { return this.pathPatternError; }
        return '-';
    }

    protected getInfoMessage(): string {
        return 'Connection succeded';
    }

    protected onChange(event: any): void {
        this.infoRequested = false;
        this.changeText.emit(event);
    }

    protected onClick(event: any): void {
        this.buttonClick.emit(event);
    }

    private checkWhteSpacePattern(): boolean {
        return this.checkPattern(this.validatorService.whiteSpaceExp);
    }

    private checkPathPattern(): boolean {
        return this.checkPattern(this.validatorService.pathExp);
    }

    private checkPattern(pattern: RegExp): boolean {
        return this.fControl.hasError('pattern') &&
            this.fControl.getError('pattern').requiredPattern === pattern.toString();
    }

}
