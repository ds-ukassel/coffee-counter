import {Component, OnInit} from '@angular/core';
import {User} from "../../core/model/user.interface";
import {CoffeeService} from "../../core/service/coffee.service";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../../core/service/user.service";
import {mergeMap, of, switchMap, tap} from "rxjs";
import {ToastService} from "ng-bootstrap-ext";

@Component({
  selector: 'app-autolog',
  templateUrl: './autolog.component.html',
  styleUrls: ['./autolog.component.scss']
})
export class AutologComponent implements OnInit {
  infoText: string | undefined;
  user!: User;

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
      this.userService.findOne(userId)
        .pipe(
          switchMap(user => {
            this.user = user;
            this.createCoffee(user);
            this.infoText = 'Logged coffee for user';
            return of(user);
          })
        )
        .subscribe();
    } else {
      this.infoText = 'No user set in settings';
    }
  }

  createCoffee(user: User) {
    this.coffeeService.create({
      userId: user._id,
      price: this.coffeeService.price,
    }).subscribe();
  }

  deleteLastCoffee() {
    this.coffeeService.findAll({userId: this.user._id}).pipe(
      mergeMap(coffees => {
        const lastCoffee = coffees[coffees.length - 1];
        return this.coffeeService.remove(lastCoffee._id).pipe(
          tap(() => {
            this.toastService.success('Delete coffee', 'Successfully deleted last coffee');
          })
        );
      })
    ).subscribe();
  }
}
