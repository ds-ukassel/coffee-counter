import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ng-bootstrap-ext';
import {SharedModule} from '../../shared/shared.module';
import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {PurchaseModalComponent} from './purchase-modal/purchase-modal.component';
import {UserListComponent} from './user-list/user-list.component';

import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    NewUserModalComponent,
    PurchaseModalComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    ModalModule,
  ],
})
export class UserModule {
}
