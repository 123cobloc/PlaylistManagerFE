import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from '../models/login.model';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private get codeVerifier(): string | null { return localStorage.getItem('codeVerifier'); }
  private set codeVerifier(codeVerifier: string | null) { codeVerifier ? localStorage.setItem('codeVerifier', codeVerifier!) : localStorage.removeItem('codeVerifier'); }
  get accessToken(): string | null { return localStorage.getItem('accessToken'); }
  set accessToken(accessToken: string | null) { accessToken ? localStorage.setItem('accessToken', accessToken!) : localStorage.removeItem('accessToken'); }
  get refreshToken(): string | null { return localStorage.getItem('refreshToken'); }
  set refreshToken(refreshToken: string | null) { refreshToken ? localStorage.setItem('refreshToken', refreshToken!) : localStorage.removeItem('refreshToken'); }
  get expires(): number | null { let tmp = localStorage.getItem('expires'); return tmp ? parseInt(tmp) : null; }
  set expires(expires: number | null) { expires ? localStorage.setItem('expires', expires.toString()) : localStorage.removeItem('expires'); }

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  hasState(): boolean {
    return !!localStorage.getItem('state');
  }

  getLoginUrl(): Observable<Login> {
    this.generateCodeVerifier();
    return this.http.get<Login>(`https://playlistmanagerapi.azurewebsites.net/api/User/loginUrl?codeVerifier=${this.codeVerifier}`);
  }

  getToken(code: string): Observable<Token> {
    let result: Observable<Token> = this.http.get<Token>(`https://playlistmanagerapi.azurewebsites.net/api/User/token?authorizationCode=${code}&codeVerifier=${this.codeVerifier}`);
    this.codeVerifier = null;
    return result;
  }

  refresh(): Observable<Token> {
    return this.http.get<Token>(`https://playlistmanagerapi.azurewebsites.net/api/User/refreshToken?refreshToken=${this.refreshToken}`);
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expires = null;
    
  }

  private generateCodeVerifier() {
    let str: string = '';
    let possible : string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i: number = 0; i < 128; i++) {
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.codeVerifier = str;
  }
}
