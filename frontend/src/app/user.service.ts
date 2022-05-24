import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
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

  createOne(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/users', user);
  }

  updateOne(user: User): Observable<User> {
    return this.http.patch<User>(environment.apiUrl + '/users/' + user._id, user);
  }

}
