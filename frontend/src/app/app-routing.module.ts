import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './module/home/home.component';
import {SettingsComponent} from './module/settings/settings.component';
import {AutologComponent} from "./module/autolog/autolog.component";

const routes: Routes = [
  {path: 'users', loadChildren: () => import('./module/user/user.module').then((m) => m.UserModule)},
  {path: 'settings', component: SettingsComponent},
  {path: 'autolog', component: AutologComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
