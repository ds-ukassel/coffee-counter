import {Component, OnInit} from '@angular/core';
import {User} from '../model/user.interface';
import {UserService} from '../user.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  id!: string;
  user!: User;
  balanceCorrection!: number;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.userService.findOne(this.id).subscribe(user => {
        this.user = user;
      });
    })
  }

  level(coffees: number): number {
    return Math.log2(coffees) | 0;
  }

  nextPowerOfTwo(n: number) {
    if (n === 0) return 1
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n + 1;
  }
}
