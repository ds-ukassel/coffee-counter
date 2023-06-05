import {Component, OnInit} from '@angular/core';
import {ApiKeyService} from '../../core/service/api-key.service';
import {UserService} from '../../core/service/user.service';
import {CookieService} from 'ngx-cookie-service';
import {User} from "../../core/model/user.interface";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  apiKey!: string;
  selectedUserId!: string;
  users!: User[];

  constructor(
    private apiKeyService: ApiKeyService,
    private userService: UserService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.apiKey = this.apiKeyService.apiKey || '';
    this.selectedUserId = this.cookieService.get('selectedUserId') || '';
    this.userService.findAll().subscribe(users => {
      this.users = users;
    });
  }

  save(): void {
    this.apiKeyService.apiKey = this.apiKey;
    const selectedUser = this.users.find(user => user._id === this.selectedUserId);
    if (selectedUser) {
      this.cookieService.set('selectedUserId', selectedUser._id);
    }
  }
}
