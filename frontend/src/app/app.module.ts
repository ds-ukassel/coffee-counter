import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng-bootstrap-ext';
import {ApiKeyInterceptor} from './core/service/api-key.interceptor';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './module/home/home.component';
import {SettingsComponent} from './module/settings/settings.component';
import {SharedModule} from './shared/shared.module';
import {PulseDirective} from './module/home/pulse.directive';
import {NgChartsModule} from 'ng2-charts';
import {CookieService} from "ngx-cookie-service";
import {AutologComponent} from './module/autolog/autolog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    PulseDirective,
    AutologComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgChartsModule,
    ToastModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ApiKeyInterceptor,
    },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
