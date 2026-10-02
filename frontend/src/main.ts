import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {enableProdMode, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withRouterConfig} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';
import {BarController, Colors, Legend} from 'chart.js';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {CookieService} from 'ngx-cookie-service';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {ApiKeyInterceptor} from './app/core/service/api-key.interceptor';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ApiKeyInterceptor,
    },
    CookieService,
    provideRouter(routes, withRouterConfig({
      paramsInheritanceStrategy: 'always',
    })),
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables(BarController, Legend, Colors)),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
})
  .catch(err => console.error(err));
