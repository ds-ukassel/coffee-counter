import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {PurchaseModalComponent} from '../admin/purchase-modal/purchase-modal.component';

const routes: Routes = [
  {
    path: '',
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
