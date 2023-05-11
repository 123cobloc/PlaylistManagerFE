import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, retry, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Token } from '../models/token.model';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('https://playlistmanagerapi.azurewebsites.net/api/User/token') || request.url.startsWith('https://playlistmanagerapi.azurewebsites.net/api/User/loginUrl') || request.url.startsWith('https://playlistmanagerapi.azurewebsites.net/api/User/refreshToken')) {
      return next.handle(request).pipe(retry(2)).pipe(tap({ error: (err: HttpErrorResponse) => this.manageError(err, request.url) }));
    }
    let token = this.auth.accessToken;
    let refreshToken = this.auth.refreshToken;
    let expires = this.auth.expires;

    if (token && expires! > Date.now()) {
      const authReq: HttpRequest<any> = this.addToken(request);
      return next.handle(authReq).pipe(retry(2)).pipe(tap({ error: (err: HttpErrorResponse) => this.manageError(err) }));;
    } else if (refreshToken) {
      return this.refreshToken(request, next);
    } else {
      return next.handle(request).pipe(tap({ error: (err: HttpErrorResponse) => this.manageError(err) }));;
    }
  }

  addToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${this.auth.accessToken}` } });
  }

  refreshToken(request: HttpRequest<any>, next: HttpHandler) {
    return this.auth.refresh().pipe(switchMap((token: Token) => {
      this.auth.accessToken = token.accessToken;
      this.auth.refreshToken = token.refreshToken;
      this.auth.expires = token.expires;
      return next.handle(this.addToken(request)).pipe(tap({ error: (err: HttpErrorResponse) => this.manageError(err) }));
    }));
  }

  manageError(err: HttpErrorResponse, reqUrl?: string) {
    if (err.status === 401) {
      this.auth.logout();
    }
    if (err.status == 403) {
      this.router.navigate(["/unauthorized"]);
    }
    if (err.status === 400 && reqUrl?.startsWith('https://playlistmanagerapi.azurewebsites.net/api/User/refreshToken')) {
      location.reload();
    }
  }
}
