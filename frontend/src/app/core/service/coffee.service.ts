import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Coffee, CoffeeDiagramData, CreateCoffeeDto, FilterCoffeeDto} from '../model/coffee.interface';

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  constructor(
    private http: HttpClient,
  ) {
  }

  findAll(filter?: FilterCoffeeDto): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(environment.apiUrl + '/coffees', {params: filter});
  }

  create(coffee: CreateCoffeeDto): Observable<Coffee> {
    return this.http.post<Coffee>(environment.apiUrl + '/coffees', coffee);
  }

  remove(id: string) {
    return this.http.delete<Coffee>(environment.apiUrl + '/coffees/' + id);
  }

  findDiagramData(userId: string): Observable<CoffeeDiagramData[]> {
    return this.http.get<CoffeeDiagramData[]>(environment.apiUrl + '/coffees/' + userId + '/diagram');
  }
}
