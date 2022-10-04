import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap, tap} from 'rxjs';
import {User} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  archived = false;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      map(({archived}) => archived === 'true'),
      tap(archived => this.archived = archived),
      switchMap(archived => this.userService.findAll(archived)),
    ).subscribe(users => {
      this.users = users;
    });
  }

  archiveUser(user: User) {
    this.userService.updateOne(user._id, {
      archived: !user.archived,
    }).subscribe(() => {
      this.users = this.users.filter(u => u._id !== user._id);
    });
  }
}
