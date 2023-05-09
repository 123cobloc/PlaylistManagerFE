import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { PlaylistService } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-first-access',
  templateUrl: './first-access.component.html',
  styleUrls: ['./first-access.component.scss']
})
export class FirstAccessComponent {

  constructor(private playlistService: PlaylistService, private router: Router) { }

  @Input() queueExists: boolean | undefined;
  @Input() playlistExists: boolean | undefined;
  queueEx: boolean | undefined;
  playlistEx: boolean | undefined;
  createQueueButton: boolean = false;
  setPlaylistButton: boolean = true;
  myPlaylists: Array<Playlist> | undefined;
  subscriptions: Array<Subscription> = [];

  ngOnInit(): void {
    this.queueEx = this.queueExists;
    this.playlistEx = this.playlistExists;
    this.subscriptions.push(this.playlistService.getMyPlaylists().subscribe({
      next: myPlaylists => this.myPlaylists = myPlaylists
    }));
  }

  checkPlaylist(playlistId: string) {
    if (!playlistId) return;
    this.setPlaylistButton = localStorage.getItem('playlistId') == playlistId;
  }

  setPlaylist(playlistId: string) {
    if (!playlistId) return;
    localStorage.setItem('playlistId', playlistId);
    this.setPlaylistButton = true;
    this.playlistEx = true;
    if (this.queueEx && this.playlistEx) location.reload();
  }

  createQueue() {
    this.subscriptions.push(this.playlistService.createQueue().subscribe({
      next: () => {
        this.createQueueButton = true;
        this.queueEx = true;
        if (this.queueEx && this.playlistEx) location.reload();
      }
    }));
  }

}
