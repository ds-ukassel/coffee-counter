import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalModule} from 'ng-bootstrap-ext';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { NewUserModalComponent } from './new-user-modal/new-user-modal.component';


@NgModule({
  declarations: [
    AdminComponent,
    NewUserModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    AdminRoutingModule,
    FormsModule,
    ModalModule,
  ],
})
export class AdminModule { }
