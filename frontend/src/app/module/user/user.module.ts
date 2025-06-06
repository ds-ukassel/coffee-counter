import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from '@mean-stream/ngbx';

import {NewUserModalComponent} from './new-user-modal/new-user-modal.component';
import {PurchaseModalComponent} from './purchase-modal/purchase-modal.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserRoutingModule} from './user-routing.module';
import {UserComponent} from './user.component';
import {AchievementModalComponent} from './achievement-modal/achievement-modal.component';
import {ShortcutListComponent} from './shortcut-list/shortcut-list.component';
import {BaseChartDirective} from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    NgbModule,
    ModalModule,
    BaseChartDirective,
    UserComponent,
    UserListComponent,
    NewUserModalComponent,
    PurchaseModalComponent,
    AchievementModalComponent,
    ShortcutListComponent,
  ],
})
export class UserModule {
}
