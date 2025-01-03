import {Routes} from '@angular/router';
import {HomeComponent} from './module/home/home.component';
import {SettingsComponent} from './module/settings/settings.component';
import {AutologComponent} from './module/autolog/autolog.component';

export const routes: Routes = [
  {path: 'users', loadChildren: () => import('./module/user/user.module').then((m) => m.UserModule)},
  {path: 'settings', component: SettingsComponent},
  {path: 'autolog', component: AutologComponent},
  {path: '', component: HomeComponent},
];
