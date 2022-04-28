import {Component, OnInit} from '@angular/core';
import {CoffeeService} from '../coffee.service';
import {Coffee} from '../model/coffee.interface';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  coffees: Coffee[] = [];
  userMap: Record<string, User> = {};

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
    this.coffeeService.create({userId: user._id}).subscribe(coffee => {
      this.coffees = [coffee, ...this.coffees.slice(0, 9)];
    });
  }

  deleteCoffee(coffee: Coffee) {
    if (!confirm('Are you sure you want to delete this coffee?')) {
      return;
    }

    this.coffeeService.remove(coffee._id).subscribe(() => {
      const index = this.coffees.indexOf(coffee);
      if (index >= 0) {
        this.coffees.splice(index, 1);
      }
    });
  }

  deleteLastCoffee(user: User) {
    const coffee = this.coffees.find(c => c.userId === user._id);
    if (coffee) {
      this.deleteCoffee(coffee);
    }
  }
}
