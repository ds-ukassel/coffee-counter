import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {map, switchMap} from 'rxjs';
import {AchievementInfo} from '../../core/model/achievement.interface';
import {Purchase} from '../../core/model/purchase.interface';
import {User} from '../../core/model/user.interface';
import {AchievementService} from '../../core/service/achievement.service';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';
import {UserService} from '../../core/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user!: User;
  purchases!: Purchase[];

  editing = false;
  // TODO this needs to be configured somewhere.
  // TODO Maybe we should even offer different types of coffees with different prices.
  //      Perhaps in a dropdown in the coffee button.
  price = 0.1;

  achievements: AchievementInfo[] = [];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private coffeeService: CoffeeService,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
    private achievementService: AchievementService,
  ) {
  }

  ngOnInit(): void {
    const userId$ = this.activatedRoute.params.pipe(map(({user}): string => user));

    userId$.pipe(
      switchMap(id => this.userService.findOne(id)),
    ).subscribe(user => {
      this.user = user;
    });

    userId$.pipe(
      switchMap(id => this.achievementService.getAll(id)),
    ).subscribe(achievements => {
      this.achievements = achievements.map(a => this.achievementService.getInfo(a.id));
    });

    userId$.pipe(
      switchMap(userId => this.purchaseService.findAll({userId})),
    ).subscribe(purchases => {
      this.purchases = purchases;
    });
  }

  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
      price: this.price,
    }).subscribe(coffee => {
      this.user.coffees++;
    });
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe(res => {
      this.user = res;
      this.editing = false;
    });
  }

  deletePurchase(purchase: Purchase) {
    this.purchaseService.remove(purchase._id).subscribe(res => {
      this.purchases = this.purchases.filter(purchase => purchase._id != res._id);
    });
  }
}
