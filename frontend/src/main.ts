import {enableProdMode, importProvidersFrom, isDevMode} from '@angular/core';

import {environment} from './environments/environment';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApiKeyInterceptor} from './app/core/service/api-key.interceptor';
import {CookieService} from 'ngx-cookie-service';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {BarController, Colors, Legend} from 'chart.js';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app/app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ToastModule} from '@mean-stream/ngbx';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppComponent} from './app/app.component';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      NgbModule,
      FormsModule,
      ToastModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })),
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ApiKeyInterceptor,
    },
    CookieService,
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables(BarController, Legend, Colors)),
  ],
})
  .catch(err => console.error(err));
