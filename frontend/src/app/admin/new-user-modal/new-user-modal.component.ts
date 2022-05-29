import {Component, OnInit} from '@angular/core';
import {CreateUserDto} from '../../model/user.interface';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss'],
})
export class NewUserModalComponent implements OnInit {
  user: CreateUserDto = {name: '', avatar: ''};

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
  }

  create() {
    this.userService.createOne(this.user).subscribe();
  }
}
