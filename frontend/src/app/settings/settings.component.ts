import { Component, OnInit } from '@angular/core';
import {ApiKeyService} from '../api-key.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  apiKey!: string;

  constructor(
    private apiKeyService: ApiKeyService,
  ) { }

  ngOnInit(): void {
    this.apiKey = this.apiKeyService.apiKey || '';
  }

  save(): void {
    this.apiKeyService.apiKey = this.apiKey;
  }
}
