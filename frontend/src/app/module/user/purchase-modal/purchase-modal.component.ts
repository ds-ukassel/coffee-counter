import {CurrencyPipe} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalModule} from '@mean-stream/ngbx';
import {switchMap} from 'rxjs';
import {CreatePurchaseDto} from '../../../core/model/purchase.interface';
import {User} from '../../../core/model/user.interface';
import {PurchaseService} from '../../../core/service/purchase.service';
import {UserService} from '../../../core/service/user.service';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
  imports: [
    ModalModule,
    FormsModule,
    CurrencyPipe,
  ],
})
export class PurchaseModalComponent implements OnInit {
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly purchaseService = inject(PurchaseService);

  user?: User;

  purchase: CreatePurchaseDto = {userId: '', total: 1};

  descriptions: string[] = [];

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(({user}) => this.userService.findOne(user)),
    ).subscribe(user => this.user = user);

    this.purchaseService.findUnique('description').subscribe(descriptions => {
      this.descriptions = descriptions.filter((s): s is string => !!s);
    });
  }

  create(): void {
    if (!this.user) {
      return;
    }
    this.purchase.userId = this.user._id;
    this.purchaseService.create(this.purchase).subscribe(purchase => {
      this.router.navigate(['..'], {relativeTo: this.route, queryParams: {newPurchase: purchase._id}});
    });
  }
}
