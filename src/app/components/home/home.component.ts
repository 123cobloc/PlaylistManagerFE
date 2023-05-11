import { Component, ElementRef, ViewChild, isDevMode } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { User } from 'src/app/models/user.model';
import { PlayerService } from 'src/app/services/player.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  myPlaylists: Array<Playlist> | undefined;
  playlist: Playlist | undefined;
  private get playlistId(): string {
    return localStorage.getItem("playlistId") ?? "";
  }
  queue: Playlist | undefined;
  user: User | undefined;
  track: Track | undefined;
  loading: boolean = true;
  private subscriptions: Array<Subscription> = [];

  constructor(private userService: UserService, private playerService: PlayerService, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    const getMe = new Promise<User | undefined>(resolve => {
      this.userService.getMe().subscribe({
        next: user => resolve(user),
        error: () => resolve(undefined)
      });
    });

    const getCurrentTrack = new Promise<Track | undefined>(resolve => {
      this.playerService.getCurrentTrack().subscribe({
        next: track => resolve(track),
        error: () => resolve(undefined)
      });
    });

    const getQueue = new Promise<Playlist | undefined>(resolve => {
      this.playlistService.getQueue().subscribe({
        next: queue => resolve(queue),
        error: () => resolve(undefined)
      });
    });

    const getPlaylist = new Promise<Playlist | undefined>(resolve => {
      this.playlistService.getPlaylist(this.playlistId).subscribe({
        next: playlist => resolve(playlist),
        error: () => resolve(undefined)
      });
    });

    Promise.all([getMe, getCurrentTrack, getQueue, getPlaylist]).then(([user, track, queue, playlist]) => {
      this.user = user;
      this.track = track;
      this.queue = queue;
      if (queue?.id != playlist?.id) this.playlist = playlist;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  lockOrientation(): void {
    if (isDevMode()) return;
    document.documentElement.requestFullscreen();
    screen.orientation.lock('portrait-primary');
  }

}
