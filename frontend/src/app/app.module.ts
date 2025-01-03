import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {isDevMode, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from '@mean-stream/ngbx';
import {ApiKeyInterceptor} from './core/service/api-key.interceptor';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './module/home/home.component';
import {SettingsComponent} from './module/settings/settings.component';
import {SharedModule} from './shared/shared.module';
import {PulseDirective} from './module/home/pulse.directive';
import {CookieService} from 'ngx-cookie-service';
import {AutologComponent} from './module/autolog/autolog.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {BarController, Colors, Legend} from 'chart.js';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    ToastModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    PulseDirective,
    AutologComponent,
  ],
  providers: [
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
export class AppModule {
}
