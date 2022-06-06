import { Injectable } from '@angular/core';

const STORAGE_KEY = 'apiKey';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  get apiKey(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  set apiKey(value: string | null) {
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
