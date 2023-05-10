import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { ItemType } from 'src/app/models/item-type.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-watchlist-list',
  templateUrl: './watchlist-list.component.html',
  styleUrls: ['./watchlist-list.component.scss']
})
export class WatchlistListComponent {
  
    loading: boolean = true;
    _itemType!: number;
    get itemType(): string {
      return ItemType[this._itemType];
    }
    items: Array<Artist | Album | Playlist | Track> | undefined;
    subscriptions: Array<Subscription> = [];

    constructor(private router: Router, private route: ActivatedRoute, private watchlistService: WatchlistService) { }

    ngOnInit(): void {
      this.subscriptions.push(this.route.queryParams.subscribe(params => {
        this._itemType = params['itemType'];
      }));
      this.subscriptions.push(this.watchlistService.getWatchlist(this._itemType!).subscribe({
        next: (items: Array<Artist | Album | Playlist | Track>) => {
          this.items = items.sort((a, b) => b.timestamp! - a.timestamp!);
          this.loading = false;
        }
      }));
    }

    goToWatchlist() {
      this.router.navigate(['/watchlist']);
    }

    removeFromWatchlist(itemId: string) {
      this.subscriptions.push(this.watchlistService.removeFromWatchlist(itemId, this._itemType!).subscribe({
        next: () => this.items = this.items?.filter(item => item.id !== itemId)
      }));
    }

    openSpotify(url: string) {
      window.open(url, "_blank");
    }
}
