import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ToastService} from '@mean-stream/ngbx';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../../core/model/user.interface';
import {ApiKeyService} from '../../core/service/api-key.service';
import {UserService} from '../../core/service/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [FormsModule],
})
export class SettingsComponent implements OnInit {
  private readonly apiKeyService = inject(ApiKeyService);
  private readonly userService = inject(UserService);
  private readonly cookieService = inject(CookieService);
  private readonly toastService = inject(ToastService);

  apiKey!: string;
  selectedUserId!: string;
  users: User[] = [];

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
