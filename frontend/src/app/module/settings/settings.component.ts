import {Component, OnInit} from '@angular/core';
import {ApiKeyService} from '../../core/service/api-key.service';
import {UserService} from '../../core/service/user.service';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../../core/model/user.interface';
import {ToastService} from '@mean-stream/ngbx';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [FormsModule],
})
export class SettingsComponent implements OnInit {
  apiKey!: string;
  selectedUserId!: string;
  users: User[] = [];

  constructor(
    private apiKeyService: ApiKeyService,
    private userService: UserService,
    private cookieService: CookieService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.apiKey = this.apiKeyService.apiKey || '';
    this.userService.findAll().subscribe(users => {
      this.users = users;
    });
    this.selectedUserId = this.cookieService.get('selectedUserId') || '';
  }

  save(): void {
    this.apiKeyService.apiKey = this.apiKey;
    const selectedUser = this.users.find(user => user._id === this.selectedUserId);
    this.cookieService.set('selectedUserId', selectedUser?._id || '');
    this.toastService.success('Save Settings', 'Successfully saved settings');
  }
}
