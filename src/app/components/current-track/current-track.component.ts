import { Component, ElementRef, Input, ViewChild, isDevMode } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { ItemType } from 'src/app/models/item-type.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { PlaylistService } from 'src/app/services/playlist.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-current-track',
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent {

  constructor(private watchlistService: WatchlistService, private playlistService: PlaylistService) { }

  @Input() track: Track | undefined;
  @Input() queue: Playlist | undefined;
  @Input() playlist: Playlist | undefined;
  @ViewChild("myToast") toastEl: ElementRef | undefined;
  myToast: bootstrap.Toast | undefined;
  toastMessage: string = "";
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

  ngOnInit(): void {
    this.myToast = new bootstrap.Toast(this.toastEl?.nativeElement);
  }

  open(item: Album | Artist | Track | undefined) {
    if (!item) return;
    this.item = item;
  }

  openSpotify(): void {
    if (!this.item) return;
    window.open(this.item.url, "_blank");
  }

  showToast(): void {
    let toast = new bootstrap.Toast(this.toastEl?.nativeElement);
    if (!toast.isShown()) toast.show();
  }

  addToWatchlist(): void {
    if (!this.item) return;
    this.subscriptions.push(this.watchlistService.addToWatchlist(this.item.id, this.itemType!).subscribe({
      next: () => {
        this.toastMessage = "Added to watchlist";
        this.showToast();
      },
      error: (err) => {
        this.toastMessage = err.status === 409 ? "Already in watchlist" : "Error adding to watchlist";
        this.showToast();
      }
    }));
  }

  addToPlaylist(): void {
    if (!this.track || !this.playlist || !this.queue) {
      this.toastMessage = `Error adding to ${this.playlist?.name ?? "playlist"}`;
      this.showToast();
      return;
    }
    this.subscriptions.push(this.playlistService.addToPlaylist(this.track.id, this.playlist.id).subscribe({
      next: () => {
        this.toastMessage = `Added to ${this.playlist!.name}`;
        this.showToast();
      },
      error: () => {
        this.toastMessage = `Error adding to ${this.playlist!.name}`;
        this.showToast();
      }
    }));
    this.subscriptions.push(this.playlistService.removeFromPlaylist(this.track.id, this.queue.id).subscribe({
      next: () => this.track!.isFromQueue = false
    }));
  }

  addToQueue(): void {
    if (!this.track || !this.queue) {
      this.toastMessage = `Error adding to Queue - PM`;
      this.showToast();
      return;
    }
    this.subscriptions.push(this.playlistService.addToPlaylist(this.track.id, this.queue.id).subscribe({
      next: () => {
        this.track!.isFromQueue = true;
        this.toastMessage = `Added to Queue - PM`;
        this.showToast();
      },
      error: () => {
        this.toastMessage = `Error adding to Queue - PM`;
        this.showToast();
      }
    }));
  }

  removeFromQueue(): void {
    if (!this.track || !this.queue) {
      this.toastMessage = `Error removing from Queue - PM`;
      this.showToast();
      return;
    }
    this.subscriptions.push(this.playlistService.removeFromPlaylist(this.track.id, this.queue.id).subscribe({
      next: () => {
        this.track!.isFromQueue = false;
        this.toastMessage = `Removed from Queue - PM`;
        this.showToast();
      },
      error: () => {
        this.toastMessage = `Error removing from Queue - PM`;
        this.showToast();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
