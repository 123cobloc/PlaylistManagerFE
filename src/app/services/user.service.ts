import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getMe(): Observable<User> {
    return this.http.get<User>('https://playlistmanagerapi.azurewebsites.net/api/User/me');
  }
}
