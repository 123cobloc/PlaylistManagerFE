import { Component, Input, isDevMode } from '@angular/core';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { Playlist } from 'src/app/models/playlist.model';
import { Track } from 'src/app/models/track.model';

@Component({
  selector: 'app-current-track',
  templateUrl: './current-track.component.html',
  styleUrls: ['./current-track.component.scss']
})
export class CurrentTrackComponent {
  @Input() track: Track | undefined;
  @Input() queue: Playlist | undefined;
  @Input() playlist: Playlist | undefined;
  isDevMode: boolean = isDevMode();
}
