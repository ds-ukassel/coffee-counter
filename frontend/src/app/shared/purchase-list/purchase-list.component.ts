import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, map, Observable, switchMap} from 'rxjs';
import {Coffee} from '../../core/model/coffee.interface';
import {Purchase} from '../../core/model/purchase.interface';
import {User} from '../../core/model/user.interface';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss'],
})
export class PurchaseListComponent implements OnInit {
  @Input() users?: Record<string, User>;

  items: (Purchase | Coffee)[] = [];

  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    const userId$ = this.route.params.pipe(map(({user}): string => user));

    userId$.pipe(
      switchMap(userId => {
        const coffees$ = this.coffeeService.findAll();
        const userCoffees$ = userId ? coffees$.pipe(map(coffees => coffees.filter(coffee => coffee.userId == userId))) : coffees$;
        const purchases$ = this.purchaseService.findAll(userId ? {userId} : {});
        return forkJoin([
          userCoffees$,
          purchases$,
        ]);
      }),
    ).subscribe(([coffees, purchases]) => {
      this.items = [...coffees, ...purchases].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 20);
    });
  }

  delete(purchase: Coffee | Purchase) {
    const del: Observable<{_id: string}> = 'total' in purchase ? this.purchaseService.remove(purchase._id) : this.coffeeService.remove(purchase._id);
    del.subscribe(res => {
      this.items = this.items.filter(purchase => purchase._id != res._id);
    });
  }
}
