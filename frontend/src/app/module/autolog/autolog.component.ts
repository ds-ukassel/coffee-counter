import {Component, OnInit} from '@angular/core';
import {User} from "../../core/model/user.interface";
import {CoffeeService} from "../../core/service/coffee.service";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "../../core/service/user.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-autolog',
  templateUrl: './autolog.component.html',
  styleUrls: ['./autolog.component.scss']
})
export class AutologComponent implements OnInit {
  infoText: string | undefined;
  infoText2: string = '';
  user!: User;

  constructor(
    private coffeeService: CoffeeService,
    private cookieService: CookieService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    const userId = this.cookieService.get('selectedUserId') || '';
    if (userId) {
      this.userService.findOne(userId).subscribe(user => {
        this.user = user;
        this.createCoffee(user);
        this.infoText = 'Logged coffee for user';
        this.infoText2 = user.name;
      });
    } else {
      this.infoText = 'No user set in settings';
      this.infoText2 = 'Please set a user in settings';
    }
  }

  createCoffee(user: User) {
    this.coffeeService.create({
      userId: user._id,
      price: this.coffeeService.price,
    }).subscribe(coffee => {
      user.coffees++;
      user.balance = (+user.balance - coffee.price).toFixed(2);
    });
  }

  deleteLastCoffee() {
    this.coffeeService.findAll({userId: this.user._id}).pipe(
      switchMap(coffees => this.coffeeService.remove(coffees[coffees.length - 1]._id)),
    ).subscribe(coffee => {
      this.user.coffees--;
      this.user.balance = (+this.user.balance + coffee.price).toFixed(2);
    });
  }
}
