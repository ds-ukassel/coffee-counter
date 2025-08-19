import {CurrencyPipe, DatePipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {Coffee} from '../../core/model/coffee.interface';
import {Purchase} from '../../core/model/purchase.interface';
import {User} from '../../core/model/user.interface';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';

interface Item {
  _id: string;
  createdAt: string;
  userId: string;
  description: string;
  type: 'purchase' | 'coffee';
  icon: string;
  money: number;
}

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
  imports: [
    NgbTooltip,
    NgbPopover,
    CurrencyPipe,
    DatePipe,
  ],
})
export class PurchaseListComponent implements OnInit {
  @Input() users?: Record<string, User>;

  items: Item[] = [];

  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private purchaseService: PurchaseService,
  ) {
  }

  addCoffee(coffee: Coffee) {
    this.items.unshift(coffeeToItem(coffee));
  }

  addPurchase(purchase: Purchase) {
    this.items.unshift(purchaseToItem(purchase));
  }

  ngOnInit(): void {
    const userId$ = this.route.params.pipe(map(({user}): string => user));

    userId$.pipe(
      switchMap(userId => forkJoin([
        this.coffeeService.findAll(userId ? {userId} : {}),
        this.purchaseService.findAll(userId ? {userId} : {}),
      ])),
    ).subscribe(([coffees, purchases]) => {
      this.items = [
        ...coffees.map(coffeeToItem),
        ...purchases.map(purchaseToItem),
      ].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 20);
    });
  }

  delete(purchase: Item) {
    const del: Observable<{ _id: string; }> = purchase.type === 'purchase' ? this.purchaseService.remove(purchase._id) : this.coffeeService.remove(purchase._id);
    del.subscribe(res => {
      this.items = this.items.filter(item => item._id !== res._id);
    });
  }
}

function coffeeToItem(c: Coffee): Item {
  return {
    _id: c._id,
    createdAt: c.createdAt,
    userId: c.userId,
    description: 'Coffee',
    type: 'coffee' as const,
    icon: 'bi-cup',
    money: -c.price,
  };
}

function purchaseToItem(p: Purchase): Item {
  return {
    _id: p._id,
    createdAt: p.createdAt,
    userId: p.userId,
    description: p.description ?? 'Purchase',
    type: 'purchase' as const,
    icon: 'bi-shop',
    money: p.total,
  }
}
