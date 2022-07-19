import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../core/model/user.interface';
import {Coffee} from '../../core/model/coffee.interface';
import {UserService} from '../../core/service/user.service';
import {CoffeeService} from '../../core/service/coffee.service';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('purchaseList') private purchaseList!: TemplateRef<any>;

  users: User[] = [];
  coffees: Coffee[] = [];
  userMap: Record<string, User> = {};

  constructor(
    private userService: UserService,
    private coffeeService: CoffeeService,
    private offcanvasService: NgbOffcanvas,
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
      price: this.coffeeService.price,
    }).subscribe(coffee => {
      user.coffees++;
      user.balance = (+user.balance - coffee.price).toFixed(2);
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

  openPurchaseList() {
    this.offcanvasService.open(this.purchaseList, {position: 'end'});
  }
}
