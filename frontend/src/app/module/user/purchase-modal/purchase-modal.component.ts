import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs';
import {User} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';
import {CreatePurchaseDto} from '../../../core/model/purchase.interface';
import {PurchaseService} from '../../../core/service/purchase.service';
import {ModalModule} from '@mean-stream/ngbx';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
  user?: User;

  purchase: CreatePurchaseDto = {userId: '', total: 1};

  descriptions: string[] = [];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private purchaseService: PurchaseService,
  ) {
  }

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
