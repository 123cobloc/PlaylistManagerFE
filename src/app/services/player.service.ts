import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from '../models/track.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  getCurrentTrack(): Observable<Track> {
    return this.http.get<Track>('https://playlistmanagerapi.azurewebsites.net/api/Player/current');
  }
}
