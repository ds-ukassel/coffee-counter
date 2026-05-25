import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list/user-list.component')
        .then((m) => m.UserListComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./new-user-modal/new-user-modal.component')
            .then((m) => m.NewUserModalComponent),
      },
      {
        path: 'purchase',
        loadComponent: () =>
          import('./purchase-modal/purchase-modal.component')
            .then((m) => m.PurchaseModalComponent),
      },
    ],
  },
  {
    path: ':user',
    loadComponent: () =>
      import('./user.component')
        .then((m) => m.UserComponent),
    children: [
      {
        path: 'purchase',
        loadComponent: () =>
          import('./purchase-modal/purchase-modal.component')
            .then((m) => m.PurchaseModalComponent),
      },
      {
        path: 'achievements/:achievement',
        loadComponent: () =>
          import('./achievement-modal/achievement-modal.component')
            .then((m) => m.AchievementModalComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
