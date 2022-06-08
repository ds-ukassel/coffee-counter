import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiKeyService} from './api-key.service';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor(
    private apiKeyService: ApiKeyService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const {apiKey} = this.apiKeyService;
    if (apiKey) {
      request = request.clone({headers: request.headers.set('X-Api-Key', apiKey)});
    }
    return next.handle(request);
  }
}
