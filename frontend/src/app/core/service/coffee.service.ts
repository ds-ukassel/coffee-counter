import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Coffee, CreateCoffeeDto} from '../model/coffee.interface';

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {

  constructor(
    private http: HttpClient,
  ) {
  }

  findAll(): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(environment.apiUrl + '/coffees');
  }

  create(coffee: CreateCoffeeDto): Observable<Coffee> {
    return this.http.post<Coffee>(environment.apiUrl + '/coffees', coffee);
  }

  remove(id: string) {
    return this.http.delete<Coffee>(environment.apiUrl + '/coffees/' + id);
  }
}
