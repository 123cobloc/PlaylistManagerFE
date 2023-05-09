import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  getPlaylist(id: string | undefined): Observable<Playlist> {
    return this.http.get<Playlist>(`https://playlistmanagerapi.azurewebsites.net/api/Playlist/${id ? id : "pmqueue"}`);
  }

  getQueue(): Observable<Playlist> {
    return this.getPlaylist(undefined);
  }

  getMyPlaylists(): Observable<Array<Playlist>> {
    return this.http.get<Array<Playlist>>("https://playlistmanagerapi.azurewebsites.net/api/Playlist/all");
  }

  createQueue():  Observable<void> {
    return this.http.post<void>("https://playlistmanagerapi.azurewebsites.net/api/Playlist/CreateQueue", {});
  }

  addToPlaylist(trackId: string, playlistId?: string): Observable<void> {
    return this.http.post<void>(`https://playlistmanagerapi.azurewebsites.net/api/Playlist/${playlistId ? playlistId : "pmqueue"}/add/${trackId}`, {});
  }

  removeFromPlaylist(trackId: string, playlistId?: string): Observable<void> {
    return this.http.delete<void>(`https://playlistmanagerapi.azurewebsites.net/api/Playlist/${playlistId ? playlistId : "pmqueue"}/remove/${trackId}`);
  }
}
