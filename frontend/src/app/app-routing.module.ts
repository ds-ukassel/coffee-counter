import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SettingsComponent} from './settings/settings.component';

const routes: Routes = [
  {path: 'users/:id', loadChildren: () => import('./user/user.module').then((m) => m.UserModule)},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)},
  {path: 'settings', component: SettingsComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
