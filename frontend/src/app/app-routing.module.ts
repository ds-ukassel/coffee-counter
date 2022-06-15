import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './module/settings/settings.component';
import {HomeComponent} from './module/home/home.component';

const routes: Routes = [
  {path: 'users', loadChildren: () => import('./module/user/user.module').then((m) => m.UserModule)},
  {path: 'settings', component: SettingsComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
