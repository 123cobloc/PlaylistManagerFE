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
  @ViewChild("checkModal") modalEl: ElementRef | undefined;
  get playlistToCheck(): Playlist | undefined {
    if (this.checkQueue) return this.queue;
    else return this.playlist;
  }
  checkQueue: boolean = false;
  perfectMatch: boolean = true;
  myToast: bootstrap.Toast | undefined;
  checkModal: bootstrap.Modal | undefined;
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

  ngAfterViewInit(): void {
    this.myToast = new bootstrap.Toast(this.toastEl?.nativeElement);
    this.checkModal = new bootstrap.Modal(this.modalEl?.nativeElement);
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
    if (!this.myToast!.isShown()) this.myToast!.show();
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

  addToPlaylist(isQueue: boolean): void {
    this.checkQueue = isQueue;
    if (!this.track || !this.queue || !this.playlistToCheck) {
      this.toastMessage = `Error adding to ${this.playlistToCheck?.name ?? "playlist"}`;
      this.showToast();
      return;
    }
    this.subscriptions.push(this.playlistService.checkIfInPlaylist(this.track.id, this.playlistToCheck.id).subscribe({
      next: (res) => {
        switch (res) {
          case 0:
            this.finalizeAdd();
            break;
          case 1:
            this.perfectMatch = false;
            this.checkModal?.show();
            break;
          case 2:
            this.perfectMatch = true;
            this.checkModal?.show();
            break;
        }
      },
      error: () => {
        this.toastMessage = `Error adding to ${this.playlistToCheck?.name ?? "playlist"}`;
        this.showToast();
        return;
      }
    }));
  }

  finalizeAdd(): void {
    if (!this.track || !this.queue || !this.playlistToCheck) return;
    this.subscriptions.push(this.playlistService.addToPlaylist(this.track.id, this.playlistToCheck.id).subscribe({
      next: () => {
        this.toastMessage = `Added to ${this.playlistToCheck!.name}`;
        this.showToast();
        if (this.queue!.id === this.playlistToCheck!.id) this.track!.isFromQueue = true;
      },
      error: () => {
        this.toastMessage = `Error adding to ${this.playlistToCheck!.name}`;
        this.showToast();
      }
    }));
    if (this.queue.id === this.playlistToCheck!.id) return;
    this.subscriptions.push(this.playlistService.removeFromPlaylist(this.track.id, this.queue.id).subscribe({
      next: () => this.track!.isFromQueue = false
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
