import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {PurchaseModalComponent} from './purchase-modal/purchase-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {path: 'new', component: NewUserModalComponent},
      {path: 'purchase', component: PurchaseModalComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
