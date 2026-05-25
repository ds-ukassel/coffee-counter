import {CurrencyPipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {EMPTY, map, switchMap, tap} from 'rxjs';

import {User} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';
import {LevelNamePipe} from '../../../shared/pipe/level-name.pipe';
import {LevelPipe} from '../../../shared/pipe/level.pipe';

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
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  users: User[] = [];
  archived = false;

  ngOnInit(): void {
    this.route.queryParams.pipe(
      map(({archived}) => archived === 'true'),
      tap(archived => this.archived = archived),
      switchMap(archived => this.userService.findAll(archived)),
    ).subscribe(users => {
      this.users = users;
    });

    this.route.queryParams.pipe(
      switchMap(({newUser}) => newUser ? this.userService.findOne(newUser) : EMPTY),
    ).subscribe(newUser => {
      this.users.push(newUser);
      this.users.sort((a, b) => a.name.localeCompare(b.name));
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {newUser: null},
        queryParamsHandling: 'merge',
      });
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
