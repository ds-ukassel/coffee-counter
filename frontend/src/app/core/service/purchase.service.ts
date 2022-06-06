import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CreatePurchaseDto, FindAllPurchaseDto, Purchase} from '../../model/purchase.interface';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {

  constructor(
    private http: HttpClient,
  ) {
  }

  findAll(dto: FindAllPurchaseDto): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(environment.apiUrl + '/purchases', {params: dto});
  }

  create(purchase: CreatePurchaseDto): Observable<Purchase> {
    return this.http.post<Purchase>(environment.apiUrl + '/purchases', purchase);
  }

  remove(id: string) {
    return this.http.delete<Purchase>(environment.apiUrl + '/purchases/' + id);
  }
}
