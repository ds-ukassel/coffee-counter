import {Component, OnInit} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CoffeeService} from '../coffee.service';
import {FindAllPurchaseDto, Purchase} from '../model/purchase.interface';
import {PurchaseService} from '../purchase.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  id!: string;
  user!: User;
  purchases!: Purchase[];

  edited = false;
  // TODO this needs to be configured somewhere.
  // TODO Maybe we should even offer different types of coffees with different prices.
  //      Perhaps in a dropdown in the coffee button.
  price = 0.1;

  constructor(
    private userService: UserService,
    private coffeeService: CoffeeService,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.userService.findOne(this.id).subscribe(user => {
        this.user = user;
      });
    })
    this.findAllPurchases();
  }

  findAllPurchases() {
    this.purchaseService.findAll({userId: this.id} as FindAllPurchaseDto).subscribe(res => {
      this.purchases = res;
    })
  }

  // TODO This implementation is temporary, later-on pure coffees will be replaced by purchases
  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
      price: this.price,
    }).subscribe(coffee => {
      this.user.coffees++;
      this.purchases = [{
        description: 'One coffee please!',
        total: -this.price
      } as Purchase, ...this.purchases.slice(0, 9)];
    });
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe(res => {
      this.user = res;
      this.edited = false;
    });
  }
}
