import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap} from 'rxjs';
import {User} from '../../model/user.interface';
import {UserService} from '../../core/service/user.service';
import {CreatePurchaseDto} from '../../model/purchase.interface';
import {PurchaseService} from '../../core/service/purchase.service';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.scss'],
})
export class PurchaseModalComponent implements OnInit {
  user!: User;

  purchase: CreatePurchaseDto = {userId: '', total: 1};

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(({user}) => this.userService.findOne(user)),
    ).subscribe(user => this.user = user);
  }

  create(): void {
    this.purchase.userId = this.user._id;
    this.purchaseService.create(this.purchase).subscribe();
  }
}
