import {DOCUMENT} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  id!: string;
  user!: User;
  balanceCorrection!: number;

  edited = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.userService.findOne(this.id).subscribe(user => {
        this.user = user;
      });
    })
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe( res => {
      this.user = res;
      this.edited = false;
    });
  }
}
