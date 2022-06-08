import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './module/settings/settings.component';
import {HomeComponent} from './module/home/home.component';

const routes: Routes = [
  {path: 'users/:id', loadChildren: () => import('./module/user/user.module').then((m) => m.UserModule)},
  {path: 'users', loadChildren: () => import('./module/admin/admin.module').then((m) => m.AdminModule)},
  {path: 'settings', component: SettingsComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
