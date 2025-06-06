import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {PurchaseService} from 'src/app/core/service/purchase.service';
import {Shortcut, User} from '../../core/model/user.interface';
import {CoffeeService} from '../../core/service/coffee.service';
import {UserService} from '../../core/service/user.service';
import {PercentPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {PulseDirective} from './pulse.directive';
import {PurchaseListComponent} from '../../shared/purchase-list/purchase-list.component';
import {LevelPipe} from '../../shared/pipe/level.pipe';
import {LevelProgressPipe} from '../../shared/pipe/level-progress.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    RouterLink,
    NgbTooltip,
    PulseDirective,
    PurchaseListComponent,
    PercentPipe,
    LevelPipe,
    LevelProgressPipe,
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild('purchaseList') private purchaseList!: TemplateRef<unknown>;

  users: User[] = [];
  userMap: Record<string, User> = {};

  constructor(
    private userService: UserService,
    private purchaseService: PurchaseService,
    private coffeeService: CoffeeService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
      for (const user of users) {
        this.userMap[user._id] = user;
      }
    });
  }

  createCoffee(user: User) {
    this.coffeeService.create({
      userId: user._id,
    }).subscribe(coffee => {
      user.coffees++;
      user.balance = (+user.balance - coffee.price).toFixed(2);
    });
  }

  deleteLastCoffee(user: User) {
    // TODO maybe this can be improved with a better endpoint, e.g. delete many with filter and limit
    this.coffeeService.findAll({userId: user._id}).pipe(
      switchMap(coffees => this.coffeeService.remove(coffees[coffees.length - 1]._id)),
    ).subscribe(coffee => {
      user.coffees--;
      user.balance = (+user.balance + coffee.price).toFixed(2);
    });
  }

  openPurchaseList() {
    this.offcanvasService.open(this.purchaseList, {position: 'end'});
  }

  applyShortcut(user:User, shortcut: Shortcut) {
    this.purchaseService.create({
      userId: user._id,
      total: shortcut.total,
      description: shortcut.description,
    }).subscribe(purchase => {
      user.balance = (+user.balance + purchase.total).toFixed(2);
    });
  }
}
