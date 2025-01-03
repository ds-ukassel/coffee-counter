import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {User} from '../../../core/model/user.interface';
import {UserService} from '../../../core/service/user.service';
import {CreatePurchaseDto} from '../../../core/model/purchase.interface';
import {PurchaseService} from '../../../core/service/purchase.service';
import {ModalModule} from '@mean-stream/ngbx';
import {CurrencyPipe, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
  imports: [
    ModalModule,
    NgIf,
    FormsModule,
    NgFor,
    CurrencyPipe,
  ],
})
export class PurchaseModalComponent implements OnInit {
  user?: User;

  purchase: CreatePurchaseDto = {userId: '', total: 1};
  multiplier = 0.01;

  descriptions: string[] = [];

  constructor(
    public route: ActivatedRoute,
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
    this.purchaseService.create(this.purchase).subscribe();
  }
}
