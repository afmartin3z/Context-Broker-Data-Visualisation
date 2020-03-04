import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
    async,
    fakeAsync,
    tick,
    ComponentFixture,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ConfigureFn, configureTests } from "../app/shared/config.helpers";

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach((() => {
        const configure: ConfigureFn = testBed => {
            testBed.configureTestingModule({
                declarations: [AppComponent],
                imports: [NoopAnimationsModule, HttpClientTestingModule],
                // schemas: [NO_ERRORS_SCHEMA],
            });
        };

        configureTests(configure).then(testBed => {
            fixture = testBed.createComponent(AppComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('should create the app', async(() => {
        const app = component;
        expect(app).toBeTruthy();
    }));

});

test.todo('a sample todo');
