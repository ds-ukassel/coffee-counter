import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {map, switchMap, tap} from 'rxjs';
import {User} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {CurrencyPipe} from '@angular/common';
import {LevelPipe} from '../../../shared/pipe/level.pipe';
import {LevelNamePipe} from '../../../shared/pipe/level-name.pipe';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    NgbTooltip,
    RouterLink,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    RouterOutlet,
    CurrencyPipe,
    LevelPipe,
    LevelNamePipe,
  ],
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

  deleteUser(user: User) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    this.userService.delete(user._id).subscribe(() => {
      this.users = this.users.filter(u => u._id !== user._id);
    });
  }
}
