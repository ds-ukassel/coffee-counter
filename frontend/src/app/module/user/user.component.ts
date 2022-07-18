import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../core/model/user.interface';
import {Purchase} from '../../core/model/purchase.interface';
import {UserService} from '../../core/service/user.service';
import {CoffeeService} from '../../core/service/coffee.service';
import {PurchaseService} from '../../core/service/purchase.service';
import {switchMap} from 'rxjs';
import Achievement from '../../core/model/achievement.interface';
import {TrophyTier} from '../../shared/pipe/trophy-tier.pipe';
import {ChartConfiguration, ChartData} from 'chart.js';
import {formatDate} from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(BaseChartDirective) coffeeChart: BaseChartDirective | undefined;

  user!: User;
  purchases!: Purchase[];

  editing = false;
  // TODO this needs to be configured somewhere.
  // TODO Maybe we should even offer different types of coffees with different prices.
  //      Perhaps in a dropdown in the coffee button.
  price = 0.1;

  // TODO rework this unto an db entity
  achievements: Achievement[] = [
    {
      image: '/assets/trophies/nightOwl.svg',
      name: 'Night Owl',
      description: 'Late at night, when everybody is sleeping, it\'s only you, your PC and your coffee.',
      tier: TrophyTier.bronze,
      hint: 'Register a Coffee between 8PM and 5AM',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/earlyBird.svg',
      name: 'Early Bird',
      description: 'The early bird catches the worm, or as a software engineer would say: "Was eine unheilige Zeit. Erstmal nen Kaffe!"',
      tier: TrophyTier.bronze,
      hint: 'Register a Coffee between 5AM and 8AM',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/mostAddictedOfThemAll.svg',
      name: 'Most Addicted',
      description: 'One coffee to rule them all, one coffee to find them, One coffee to bring them all, and in the darkness bind them.',
      tier: TrophyTier.platinum,
      hint: 'Have more coffees registered as any other user',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfMilk.svg',
      name: 'Buyer of Milk',
      description: 'Milk is good for your bones! - Skeletor',
      tier: TrophyTier.silver,
      hint: 'Register 5 milk purchases',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfNoMilk.svg',
      name: 'Buyer of Non-Milk',
      description: 'By the way, i\'m vegan - Every vegan, ever',
      tier: TrophyTier.silver,
      hint: 'Register 5 milk-alternative purchases',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfCoffee.svg',
      name: 'Buyer of Coffee',
      description: 'In germany we call it: "Irgendwer muss ja den Laden am Laufen halten."',
      tier: TrophyTier.gold,
      hint: 'Register 10 coffee purchases',
      receivedAt: new Date()
    }
  ]

  // TODO move to own components when clear how achievements are implemented
  currentAchievement!: Achievement;
  showHint: boolean = false;

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
  ) {
  }

  ngOnInit(): void {
    this.findOneUser();
    this.findAllPurchases();
    this.findAllCoffee()
  }

  private findOneUser() {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.userService.findOne(id)),
    ).subscribe(user => {
      this.user = user;
    });
  }

  findAllPurchases() {
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.purchaseService.findAll({userId: id})),
    ).subscribe(purchases => this.purchases = purchases);
  }

  findAllCoffee() {
    this.activatedRoute.params.subscribe(({id}) => {
        this.coffeeService.findAll().subscribe(coffee => {
          const userCoffee = coffee.filter(cofefe => cofefe.userId === id)
          userCoffee.forEach(c => {
            const index: number = +formatDate(c.createdAt, 'H', 'DE-de')
            this.coffeeData.datasets[0].data[index]++;
          });
          this.coffeeChart?.update();
        })
      }
    );
  }

  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
      price: this.price,
    }).subscribe(coffee => {
      this.user.coffees++;
    });
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe(res => {
      this.user = res;
      this.editing = false;
    });
  }

  deletePurchase(purchase: Purchase) {
    this.purchaseService.remove(purchase._id).subscribe(res => {
      this.purchases = this.purchases.filter(purchase => purchase._id != res._id);
    });
  }

  open(achievement: any, modal: any) {
    this.currentAchievement = achievement;
    this.modalService.open(modal, {size: 'lg', centered: true}).result.then();
  }

}
