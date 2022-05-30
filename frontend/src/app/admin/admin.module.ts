import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ng-bootstrap-ext';
import {SharedModule} from '../shared/shared.module';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin.component';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {PurchaseModalComponent} from './purchase-modal/purchase-modal.component';


@NgModule({
  declarations: [
    AdminComponent,
    NewUserModalComponent,
    PurchaseModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    AdminRoutingModule,
    FormsModule,
    ModalModule,
    SharedModule,
  ],
})
export class AdminModule {
}
