import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';
import {environment} from './environment';

@Injectable()
export class ApiKeyGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		return !environment.apiKey || req.header('X-Api-Key') === environment.apiKey;
	}
}
