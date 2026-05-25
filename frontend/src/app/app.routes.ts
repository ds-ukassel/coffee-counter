import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () =>
      import('./module/user/user.routes')
        .then((m) => m.routes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./module/settings/settings.component')
        .then((m) => m.SettingsComponent),
  },
  {
    path: 'autolog',
    loadComponent: () =>
      import('./module/autolog/autolog.component')
        .then((m) => m.AutologComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./module/home/home.component')
        .then((m) => m.HomeComponent),
  },
];
