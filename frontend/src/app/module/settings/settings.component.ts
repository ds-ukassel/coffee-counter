import {Component, OnInit} from '@angular/core';
import {ApiKeyService} from '../../core/service/api-key.service';
import {UserService} from "../../core/service/user.service";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  apiKey!: string;
  userName!: string;
  users!: {name: string; _id: string}[];

  constructor(
    private apiKeyService: ApiKeyService,
    private userService: UserService,
    private cookieService: CookieService,
  ) {
  }

  ngOnInit(): void {
    this.apiKey = this.apiKeyService.apiKey || '';
    this.userName = this.cookieService.get('selectedUserName') || '';
    this.userService.findAll().subscribe(users => {
      this.users = users.map(user => ({ _id: user._id, name: user.name }));
    });
  }

  save(): void {
    this.apiKeyService.apiKey = this.apiKey;
    this.cookieService.set('selectedUserName', this.userName);
  }
}
