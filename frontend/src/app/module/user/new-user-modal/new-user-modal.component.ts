import {Component, OnInit} from '@angular/core';
import {ModalComponent} from 'ng-bootstrap-ext';
import {CreateUserDto} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss'],
})
export class NewUserModalComponent implements OnInit {
  user: CreateUserDto = {name: '', balance: '0.00', coffees: 0};
  creating = false;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
  }

  create(modal: ModalComponent): void {
    if (!this.user.avatar) {
      delete this.user.avatar;
    }
    this.user.balance += '';
    this.creating = true;
    this.userService.createOne(this.user).subscribe(() => {
      this.creating = false;
      modal.close();
    }, error => {
      this.creating = false;
      console.error(error);
    });
  }
}
