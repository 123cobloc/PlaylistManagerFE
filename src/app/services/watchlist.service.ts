import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemType } from '../models/item-type.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(private http: HttpClient) { }

  addToWatchlist(itemId: string, itemType: ItemType): Observable<void> {
    return this.http.post<void>(`https://playlistmanagerapi.azurewebsites.net/api/Watchlist/add/${itemType}/${itemId}`, null);
  }
}
