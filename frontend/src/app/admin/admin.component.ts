import {Component, OnInit} from '@angular/core';
import {User} from '../core/model/user.interface';
import {UserService} from '../core/service/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
    });
  }
}
