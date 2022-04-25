import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {Coffee, CreateCoffeeDto} from './model/coffee.interface';
import {User} from './model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) {
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users');
  }

  create(coffee: CreateCoffeeDto): Observable<Coffee> {
    return this.http.post<Coffee>(environment.apiUrl + '/coffees', coffee);
  }
}
