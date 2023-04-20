import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Track } from 'src/app/models/track.model';
import { User } from 'src/app/models/user.model';
import { PlayerService } from 'src/app/services/player.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  user: User | null = null;
  track: Track | null = null;
  get artists(): string { return this.track ? this.track.artists.map(artist => artist.name).join(', ') : ""; }
  private subscriptions: Array<Subscription> = [];

  constructor(private userService: UserService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.user = user));
    this.subscriptions.push(this.playerService.getCurrentTrack().subscribe(track => this.track = track));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
