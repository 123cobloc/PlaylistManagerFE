import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';
import { User } from 'src/app/models/user.model';
import { PlayerService } from 'src/app/services/player.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  playlist: Playlist | undefined;
  private get playlistId(): string | null {
    return localStorage.getItem("playlistId");
  }
  queue: Playlist | undefined;
  user: User | undefined;
  track: Track | undefined;
  loading: number = 0;
  private subscriptions: Array<Subscription> = [];

  constructor(private userService: UserService, private playerService: PlayerService, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.getMe().subscribe({
      next: user => this.user = user,
      complete: () => this.loading++
    }));
    this.subscriptions.push(this.playerService.getCurrentTrack().subscribe({
      next: track => this.track = track,
      complete: () => this.loading++
    }));
    this.subscriptions.push(this.playlistService.getQueue().subscribe({
      next: queue => this.queue = queue,
      complete: () => this.loading++
    }));
    if (this.playlistId) {
      this.subscriptions.push(this.playlistService.getPlaylist(this.playlistId).subscribe({
        next: playlist => this.playlist = playlist,
        complete: () => this.loading++
      }));
    } else {
      this.loading++;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
