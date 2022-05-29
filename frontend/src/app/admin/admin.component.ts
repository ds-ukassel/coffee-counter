import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('modalRef') modalRef!: TemplateRef<any>;

  users: User[] = [];

  createName: string = '';
  createAvatar: string = '';

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
    private modalService: NgbModal,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
    });
  }

  openUserCreateModal() {
    this.modalService.open(this.modalRef, {size: 'lg', centered: true}).result.then((result) => {
      this.createUser();
    }, (reason) => {
      this.resetModal();
    });
  }

  resetModal() {
    this.createName = '';
    this.createAvatar = '';
  }

  createUser() {
    const newUser = {name: this.createName, avatar: this.createAvatar} as User
    this.userService.createOne(newUser).subscribe(user => {
      this.users.push(user);
      this.resetModal();
    })
  }

  tintBalance(balance: number) {
    return balance < 0 ? 'red' : '';
  }
}
