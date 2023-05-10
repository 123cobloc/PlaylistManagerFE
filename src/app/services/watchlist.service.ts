import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemType } from '../models/item-type.model';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';
import { Playlist } from '../models/playlist.model';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private http: HttpClient) { }

  addToWatchlist(itemId: string, itemType: ItemType): Observable<void> {
    return this.http.post<void>(`https://playlistmanagerapi.azurewebsites.net/api/Watchlist/add/${itemType}/${itemId}`, null);
  }

  removeFromWatchlist(itemId: string, itemType: number): Observable<void> {
    return this.http.delete<void>(`https://playlistmanagerapi.azurewebsites.net/api/Watchlist/remove/${itemType}/${itemId}`);
  }

  getWatchlist(itemType: number): Observable<Array<Album | Artist | Playlist | Track>> {
    return this.http.get<Array<Album | Artist | Playlist | Track>>(`https://playlistmanagerapi.azurewebsites.net/api/Watchlist/${itemType}`);
  }

}
