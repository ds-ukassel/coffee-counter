import {Component, inject, OnInit} from '@angular/core';
import {ToastService} from '@mean-stream/ngbx';
import {CookieService} from 'ngx-cookie-service';
import {switchMap, tap} from 'rxjs';

import {User} from '../../core/model/user.interface';
import {CoffeeService} from '../../core/service/coffee.service';
import {UserService} from '../../core/service/user.service';

@Component({
  selector: 'app-autolog',
  templateUrl: './autolog.component.html',
  styleUrls: ['./autolog.component.scss'],
})
export class AutologComponent implements OnInit {
  private readonly coffeeService = inject(CoffeeService);
  private readonly cookieService = inject(CookieService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  infoText: string | undefined;
  user: User | null | undefined;

  ngOnInit(): void {
    const userId = this.cookieService.get('selectedUserId') || '';
    if (userId) {
      this.userService.findOne(userId).pipe(
        tap(user => this.user = user),
        switchMap(user => this.createCoffee(user))
      ).subscribe(() => this.infoText = 'Logged coffee for user');
    } else {
      this.infoText = 'No user set';
    }
  }

  createCoffee(user: User) {
    return this.coffeeService.create({
      userId: user._id,
    });
  }

  deleteLastCoffee() {
    console.log("Test");
    this.coffeeService.findAll({userId: this.user?._id}).pipe(
      switchMap(coffees => this.coffeeService.remove(coffees[coffees.length - 1]._id)),
    ).subscribe(() => {
      console.log("2. Test");
      this.toastService.success('Delete coffee', 'Successfully deleted last coffee');
    });
  }
}
