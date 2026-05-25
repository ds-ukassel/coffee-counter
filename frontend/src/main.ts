import {enableProdMode, isDevMode, provideZoneChangeDetection} from '@angular/core';

import {environment} from './environments/environment';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApiKeyInterceptor} from './app/core/service/api-key.interceptor';
import {CookieService} from 'ngx-cookie-service';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {BarController, Colors, Legend} from 'chart.js';
import {bootstrapApplication} from '@angular/platform-browser';
import {routes} from './app/app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import {provideRouter, withRouterConfig} from '@angular/router';

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
