import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CreateUserDto, UpdateUserDto, User} from '../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) {
  }

  findAll(archived = false): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/users', {params: {archived}});
  }

  findOne(userId: string) {
    return this.http.get<User>(environment.apiUrl + '/users/' + userId);
  }

  createOne(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/users', user);
  }

  updateOne(id: string, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(environment.apiUrl + '/users/' + id, dto);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(environment.apiUrl + '/users/' + id);
  }
}
