import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChartData} from 'chart.js';
import {ToastService} from '@mean-stream/ngbx';
import {BaseChartDirective} from 'ng2-charts';
import {map, switchMap} from 'rxjs';
import {AchievementInfo} from '../../core/model/achievement.interface';
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
  @ViewChild(BaseChartDirective) coffeeChart: BaseChartDirective | undefined;

  user!: User;
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
    private modalService: NgbModal,
    private userService: UserService,
    private coffeeService: CoffeeService,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
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
  }

  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
    }).subscribe(coffee => {
      this.user.coffees++;
      this.user.balance = (+this.user.balance - coffee.price).toFixed(2);
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
