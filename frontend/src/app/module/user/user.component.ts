import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgbPopover, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {ChartData} from 'chart.js';
import {ToastService} from '@mean-stream/ngbx';
import {BaseChartDirective} from 'ng2-charts';
import {EMPTY, map, switchMap} from 'rxjs';
import {AchievementInfo} from '../../core/model/achievement.interface';
import {User} from '../../core/model/user.interface';
import {AchievementService} from '../../core/service/achievement.service';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';
import {UserService} from '../../core/service/user.service';
import {CurrencyPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ShortcutListComponent} from './shortcut-list/shortcut-list.component';
import {PurchaseListComponent} from '../../shared/purchase-list/purchase-list.component';
import {LevelPipe} from '../../shared/pipe/level.pipe';
import {LevelNamePipe} from '../../shared/pipe/level-name.pipe';
import {NextLevelPipe} from '../../shared/pipe/level-progress.pipe';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [
    NgbTooltip,
    NgbPopover,
    FormsModule,
    RouterLink,
    ShortcutListComponent,
    BaseChartDirective,
    PurchaseListComponent,
    RouterOutlet,
    CurrencyPipe,
    LevelPipe,
    LevelNamePipe,
    NextLevelPipe,
  ],
})
export class UserComponent implements OnInit {
  @ViewChild(BaseChartDirective) coffeeChart: BaseChartDirective | undefined;
  @ViewChild(PurchaseListComponent) purchaseList: PurchaseListComponent | undefined;

  user?: User;
  editName?: string;
  editAvatar?: string;

  achievements: AchievementInfo[] = [];

  coffeeData: ChartData<'bar'> = {
    labels: Array(24).fill(0).map((x, i) => `${i} Uhr`),
    datasets: [
      {
        label: 'Coffees',
        backgroundColor: '#a07150',
        borderColor: 'none',
        hoverBackgroundColor: '#a0715099',
        data: Array(24).fill(0),
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private coffeeService: CoffeeService,
    private purchaseService: PurchaseService,
    private activatedRoute: ActivatedRoute,
    private achievementService: AchievementService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    const userId$ = this.activatedRoute.params.pipe(map(({user}): string => user));

    userId$.pipe(
      switchMap(id => this.userService.findOne(id)),
    ).subscribe(user => {
      this.user = user;
      this.user.shortcuts ||= [];
    });

    userId$.pipe(
      switchMap(id => this.achievementService.getAll(id)),
    ).subscribe(achievements => {
      this.achievements = achievements.map(a => this.achievementService.getInfo(a.id));
    });

    userId$.pipe(
      switchMap(id => this.coffeeService.findDiagramData(id)),
    ).subscribe(userCoffeeData => {
      for (const {hour, total} of userCoffeeData) {
        this.coffeeData.datasets[0].data[hour] = total;
      }
      this.coffeeChart?.update();
    });

    this.route.queryParams.pipe(
      switchMap(({newPurchase}) => newPurchase ? this.purchaseService.findOne(newPurchase) : EMPTY),
    ).subscribe(newPurchase => {
      if (this.user) {
        this.user.balance = (+this.user.balance + newPurchase.total).toFixed(2);
      }
      this.purchaseList?.addPurchase(newPurchase);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {newPurchase: null},
        queryParamsHandling: 'merge',
      });
    });
  }

  createCoffee() {
    if (!this.user) {
      return;
    }
    this.coffeeService.create({
      userId: this.user._id,
    }).subscribe(coffee => {
      this.user!.coffees++;
      this.user!.balance = (+this.user!.balance - coffee.price).toFixed(2);
      this.purchaseList?.addCoffee(coffee);

      const hour = new Date(coffee.createdAt).getHours();
      const data = this.coffeeData.datasets[0].data;
      const datum = data[hour];
      data[hour] = (datum && typeof datum === 'number' ? datum : 0) + 1;
      this.coffeeChart?.update();
      this.toastService.success('Add Coffee', 'Successfully added coffee');
    }, error => {
      this.toastService.error('Add Coffee', 'Failed to add cofee', error);
    });
  }

  updateUser() {
    if (!this.user) {
      return;
    }
    this.userService.updateOne(this.user._id, {
      name: this.editName || this.user.name,
      avatar: this.editAvatar || this.user.avatar,
    }).subscribe(res => {
      this.user = res;
      this.toastService.success('Update Profile', 'Successfully updated profile');
      delete this.editName;
      delete this.editAvatar;
    }, error => {
      this.toastService.error('Update Profile', 'Failed to update profile', error);
    });
  }

  saveShortcuts() {
    if (!this.user) {
      return;
    }
    this.userService.updateOne(this.user._id, {
      shortcuts: this.user.shortcuts,
    }).subscribe(res => {
      this.user = res;
      this.toastService.success('Save Shortcuts', 'Successfully saved shortcuts');
    }, error => {
      this.toastService.error('Save Shortcuts', 'Failed to save shortcuts', error);
    });
  }
}
