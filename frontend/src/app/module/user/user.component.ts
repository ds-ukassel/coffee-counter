import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {map, switchMap} from 'rxjs';
import {AchievementInfo} from '../../core/model/achievement.interface';
import {User} from '../../core/model/user.interface';
import {AchievementService} from '../../core/service/achievement.service';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';
import {UserService} from '../../core/service/user.service';
import {ChartData} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild(BaseChartDirective) coffeeChart: BaseChartDirective | undefined;

  user!: User;

  editing = false;

  achievements: AchievementInfo[] = [];

  coffeeData: ChartData<'bar'> = {
    labels: [
      '0 Uhr',
      '1 Uhr',
      '2 Uhr',
      '3 Uhr',
      '4 Uhr',
      '5 Uhr',
      '6 Uhr',
      '7 Uhr',
      '8 Uhr',
      '9 Uhr',
      '10 Uhr',
      '11 Uhr',
      '12 Uhr',
      '13 Uhr',
      '14 Uhr',
      '15 Uhr',
      '16 Uhr',
      '17 Uhr',
      '18 Uhr',
      '19 Uhr',
      '20 Uhr',
      '21 Uhr',
      '22 Uhr',
      '23 Uhr',
    ],
    datasets: [
      {
        label: '#Kaffee',
        backgroundColor: '#a07150',
        borderColor: 'none',
        hoverBackgroundColor: '#a0715099',
        data: [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
      }
    ]
  }


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
      switchMap(id => this.coffeeService.findDiagramData(id)),
    ).subscribe(userCoffeeData => {
      userCoffeeData.forEach((coffeeDate) => {
        this.coffeeData.datasets[0].data[coffeeDate._id] = coffeeDate.total
      });
      this.coffeeChart?.update();
    });
  }

  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
      price: this.coffeeService.price,
    }).subscribe(coffee => {
      this.user.coffees++;
      this.user.balance = (+this.user.balance - coffee.price).toFixed(2);
    });
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe(res => {
      this.user = res;
      this.editing = false;
    });
  }
}
