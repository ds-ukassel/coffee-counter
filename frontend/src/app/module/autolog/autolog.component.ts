import {Component, OnInit} from '@angular/core';
import {User} from "../../core/model/user.interface";
import {CoffeeService} from "../../core/service/coffee.service";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../../core/service/user.service";
import {switchMap, tap} from "rxjs";
import {ToastService} from "ng-bootstrap-ext";

@Component({
  selector: 'app-autolog',
  templateUrl: './autolog.component.html',
  styleUrls: ['./autolog.component.scss']
})
export class AutologComponent implements OnInit {
  infoText: string | undefined;
  user: User | null | undefined;

  constructor(
    private coffeeService: CoffeeService,
    private cookieService: CookieService,
    private userService: UserService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    const userId = this.cookieService.get('selectedUserId') || '';
    if (userId) {
      this.userService.findOne(userId).pipe(
        tap(user => {
          this.user = user;
          this.createCoffee(user);
          this.infoText = 'Logged coffee for user';
        })
      ).subscribe();
    } else {
      this.infoText = 'No user set';
    }
  }

  createCoffee(user: User) {
    this.coffeeService.create({
      userId: user._id,
      price: this.coffeeService.price,
    }).subscribe();
  }

  deleteLastCoffee() {
    this.coffeeService.findAll({userId: this.user?._id}).pipe(
      switchMap(coffees => this.coffeeService.remove(coffees[coffees.length - 1]._id)),
    ).subscribe(() => this.toastService.success('Delete coffee', 'Successfully deleted last coffee'));
  }
}
