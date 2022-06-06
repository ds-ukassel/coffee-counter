import {Component, OnInit} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CoffeeService} from '../coffee.service';
import {FindAllPurchaseDto, Purchase} from '../model/purchase.interface';
import {PurchaseService} from '../purchase.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  id!: string;
  user!: User;
  purchases!: Purchase[];

  edited = false;
  // TODO this needs to be configured somewhere.
  // TODO Maybe we should even offer different types of coffees with different prices.
  //      Perhaps in a dropdown in the coffee button.
  price = 0.1;

  // TODO rework this unto an db entity
  achievements = [
    {
      image: '/assets/trophies/nightOwl.svg',
      name: 'Night Owl',
      description: 'Late at night, when everybody is sleeping, it\'s only you, your PC and your coffee.',
      tier: 'bronze',
      hint: 'Register a Coffee between 8PM and 5AM',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/earlyBird.svg',
      name: 'Early Bird',
      description: 'The early bird catches the worm, or as a software engineer would say: "Was eine unheilige Zeit. Erstmal nen Kaffe!"',
      tier: 'bronze',
      hint: 'Register a Coffee between 5AM and 8AM',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/mostAddictedOfThemAll.svg',
      name: 'Most Addicted',
      description: 'One coffee to rule them all, one coffee to find them, One coffee to bring them all, and in the darkness bind them.',
      tier: 'platinum',
      hint: 'Have more coffees registered as any other user',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfMilk.svg',
      name: 'Buyer of Milk',
      description: 'Milk is good for your bones! - Skeletor',
      tier: 'silver',
      hint: 'Register 5 milk purchases',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfNoMilk.svg',
      name: 'Buyer of Non-Milk',
      description: 'By the way, i\'m vegan - Every vegan, ever',
      tier: 'silver',
      hint: 'Register 5 milk-alternative purchases',
      receivedAt: new Date()
    },
    {
      image: '/assets/trophies/buyerOfCoffee.svg',
      name: 'Buyer of Coffee',
      description: 'In germany we call it: "Irgendwer muss ja den Laden am Laufen halten."',
      tier: 'gold',
      hint: 'Register 10 coffee purchases',
      receivedAt: new Date()
    }
  ]

  // TODO move to own components when clear how achievements are implemented
  currentAchievement!: { image: string, name: string, description: string, tier: 'bronze' | 'silver' | 'gold' | 'platinum', hint: string, receivedAt: Date };
  showHint: boolean = false;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private coffeeService: CoffeeService,
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.userService.findOne(this.id).subscribe(user => {
        this.user = user;
      });
    })
    this.findAllPurchases();
  }

  findAllPurchases() {
    this.purchaseService.findAll({userId: this.id} as FindAllPurchaseDto).subscribe(res => {
      this.purchases = res;
    })
  }

  // TODO This implementation is temporary, later-on pure coffees will be replaced by purchases
  createCoffee() {
    this.coffeeService.create({
      userId: this.user._id,
      price: this.price,
    }).subscribe(coffee => {
      this.user.coffees++;
      this.purchases = [{
        description: 'One coffee please!',
        total: -this.price
      } as Purchase, ...this.purchases.slice(0, 9)];
    });
  }

  updateUser() {
    this.userService.updateOne(this.user).subscribe(res => {
      this.user = res;
      this.edited = false;
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

  trophyStyle(): string {
    switch (this.currentAchievement.tier) {
      case 'bronze':
        return 'text-primary';
      case 'silver':
        return 'text-info';
      case 'gold':
        return 'text-warning';
      case 'platinum':
        return 'text-secondary';
      default:
        return 'text-warning';
    }

  }
}
