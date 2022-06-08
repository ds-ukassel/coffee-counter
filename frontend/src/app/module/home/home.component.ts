import {Component, OnInit} from '@angular/core';
import {User} from '../../core/model/user.interface';
import {Coffee} from '../../core/model/coffee.interface';
import {UserService} from '../../core/service/user.service';
import {CoffeeService} from '../../core/service/coffee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  coffees: Coffee[] = [];
  userMap: Record<string, User> = {};

  // TODO this needs to be configured somewhere.
  // TODO Maybe we should even offer different types of coffees with different prices.
  //      Perhaps in a dropdown in the coffee button.
  price = 0.1;

  constructor(
    private userService: UserService,
    private coffeeService: CoffeeService,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
      for (let user of users) {
        this.userMap[user._id] = user;
      }
    });
    this.coffeeService.findAll().subscribe(coffees => this.coffees = coffees.slice(-10).reverse());
  }

  createCoffee(user: User) {
    this.coffeeService.create({
      userId: user._id,
      price: this.price,
    }).subscribe(coffee => {
      user.coffees++;
      this.coffees = [coffee, ...this.coffees.slice(0, 9)];
    });
  }

  deleteCoffee(coffee: Coffee) {
    this.coffeeService.remove(coffee._id).subscribe(() => {
      const index = this.coffees.indexOf(coffee);
      if (index >= 0) {
        this.coffees.splice(index, 1);
      }
      const user = this.userMap[coffee.userId];
      user && user.coffees--;
    });
  }

  deleteLastCoffee(user: User) {
    const coffee = this.coffees.find(c => c.userId === user._id);
    if (coffee) {
      this.deleteCoffee(coffee);
    }
  }
}
