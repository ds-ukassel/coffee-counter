import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserComponent} from './user.component';
import {PurchaseModalComponent} from './purchase-modal/purchase-modal.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    children: [
      {path: 'new', component: NewUserModalComponent},
      {path: 'purchase', component: PurchaseModalComponent},
    ],
  },
  {
    path: ':id',
    component: UserComponent,
    children: [
      {path: 'purchase', component: PurchaseModalComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}