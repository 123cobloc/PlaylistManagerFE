import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-watchlist-list',
  templateUrl: './watchlist-list.component.html',
  styleUrls: ['./watchlist-list.component.scss']
})
export class WatchlistListComponent {
  
    itemType: number | undefined;
    items: Array<Artist | Album | Playlist | Track> | undefined;
    subscriptions: Array<Subscription> = [];

    constructor(private route: ActivatedRoute, private watchlistService: WatchlistService) { }

    ngOnInit(): void {
      this.subscriptions.push(this.route.queryParams.subscribe(params => {
        this.itemType = params['itemType'];
      }));
      this.subscriptions.push(this.watchlistService.getWatchlist(this.itemType!).subscribe({
        next: (items: Array<Artist | Album | Playlist | Track>) => {
          this.items = items;
        }
      }));
    }
}
