import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from '../shared/shared.module';
import {ModalModule} from 'ng-bootstrap-ext';


@NgModule({
  declarations: [
    UserComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        FormsModule,
        NgbModule,
        SharedModule,
        ModalModule
    ]
})
export class UserModule { }
