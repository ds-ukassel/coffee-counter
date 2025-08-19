import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserDto} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';

@Component({
  selector: 'app-new-user-modal',
  templateUrl: './new-user-modal.component.html',
  styleUrls: ['./new-user-modal.component.scss'],
  imports: [
    ModalModule,
    FormsModule,
    NgbTooltip,
  ],
})
export class NewUserModalComponent {
  user: CreateUserDto = {name: '', balance: '0.00', coffees: 0, achievements: 0};
  creating = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  create(): void {
    if (!this.user.avatar) {
      delete this.user.avatar;
    }
    this.user.balance += '';
    this.creating = true;
    this.userService.createOne(this.user).subscribe(user => {
      this.creating = false;
      this.router.navigate(['..'], {
        relativeTo: this.route,
        queryParams: {newUser: user._id},
        queryParamsHandling: 'merge',
      });
    }, error => {
      this.creating = false;
      console.error(error);
    });
  }
}
