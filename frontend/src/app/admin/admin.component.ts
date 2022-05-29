import {Component, OnInit} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];

  readonly levelNames = [
    'Newbie coffee tester',
    'Newcomer coffee drinker',
    'Starter coffee brewer',
    'Beginner coffee taster',
    'Intermediate coffee enjoyer',
    'Advanced coffee lover',
    'Expert coffee aficionado',
    'Master coffee connoisseur',
    'Grandmaster coffee consummate',
    'Legendary coffee overlord',
    'Immortal coffee guru',
    'God of coffee',
    'The one above all coffee gods',
  ];

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
