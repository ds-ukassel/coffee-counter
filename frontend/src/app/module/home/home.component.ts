import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {switchMap} from 'rxjs';
import {PurchaseService} from 'src/app/core/service/purchase.service';
import {Shortcut, User} from '../../core/model/user.interface';
import {CoffeeService} from '../../core/service/coffee.service';
import {UserService} from '../../core/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  @ViewChild('purchaseList') private purchaseList!: TemplateRef<any>;
  @ViewChild('video', {static: true}) private video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', {static: true}) private canvas!: ElementRef<HTMLCanvasElement>;

  users: User[] = [];
  userMap: Record<string, User> = {};

  constructor(
    private userService: UserService,
    private purchaseService: PurchaseService,
    private coffeeService: CoffeeService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({
      video: true,
    }).then(stream => {
      this.video.nativeElement.srcObject = stream;
    });

    this.userService.findAll().subscribe(users => {
      this.users = users;
      for (let user of users) {
        this.userMap[user._id] = user;
      }
    });
  }

  createCoffee(user: User) {
    const photo = this.captureImage();
    user.avatar = photo;

    this.coffeeService.create({
      userId: user._id,
      photo,
    }).subscribe(coffee => {
      user.coffees++;
      user.balance = (+user.balance - coffee.price).toFixed(2);
    });
  }

  private captureImage() {
    const canvas = this.canvas.nativeElement;
    const video = this.video.nativeElement;
    const imageSize = 256;
    canvas.width = imageSize;
    canvas.height = imageSize * video.videoHeight / video.videoWidth;
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }

  deleteLastCoffee(user: User) {
    // TODO maybe this can be improved with a better endpoint, e.g. delete many with filter and limit
    this.coffeeService.findAll({userId: user._id}).pipe(
      switchMap(coffees => this.coffeeService.remove(coffees[coffees.length - 1]._id)),
    ).subscribe(coffee => {
      user.coffees--;
      user.balance = (+user.balance + coffee.price).toFixed(2);
    });
  }

  openPurchaseList() {
    this.offcanvasService.open(this.purchaseList, {position: 'end'});
  }

  applyShortcut(user:User, shortcut: Shortcut) {
    this.purchaseService.create({
      userId: user._id,
      total: shortcut.total,
      description: shortcut.description,
    }).subscribe(purchase => {
      user.balance = (+user.balance + purchase.total).toFixed(2);
    });
  }
}
