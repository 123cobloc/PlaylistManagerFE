import { Component, Input, isDevMode } from '@angular/core';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { ItemType } from 'src/app/models/item-type.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-current-track',
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent {

  constructor(private watchlistService: WatchlistService) { }

  @Input() track: Track | undefined;
  @Input() queue: Playlist | undefined;
  @Input() playlist: Playlist | undefined;
  subscriptions: Array<Subscription> = [];
  item: Album | Artist | Track | undefined;
  get itemType(): ItemType | undefined {
    if (!this.item) return;
    switch (this.item.url.charAt(28)) {
      case 'u':
        return ItemType.Album;
      case 'i':
        return ItemType.Artist;
      case 'c':
        return ItemType.Track;
      default:
        return;
    }
  };
  isDevMode: boolean = isDevMode();

  open(item: Album | Artist | Track | undefined) {
    if (!item) return;
    this.item = item;
  }

  openSpotify(): void {
    if (!this.item) return;
    window.open(this.item.url, "_blank");
  }

  addToWatchlist(): void {
    if (!this.item || !this.itemType) return;
    this.subscriptions.push(this.watchlistService.addToWatchlist(this.item.id, this.itemType).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
