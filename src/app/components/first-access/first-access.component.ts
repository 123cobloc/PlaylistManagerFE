import { Component, Input } from '@angular/core';
import { Playlist } from 'src/app/models/playlist.model';

@Component({
  selector: 'app-first-access',
  templateUrl: './first-access.component.html',
  styleUrls: ['./first-access.component.scss']
})
export class FirstAccessComponent {

  @Input() myPlaylists: Array<Playlist> | undefined;
  selectedId: string | undefined;

}
