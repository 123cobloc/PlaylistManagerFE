import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private router: Router, private authService: AuthService) { }

  goToHome() {
    this.router.navigate(['/']);
  }

  resetPlaylist() {
    localStorage.removeItem("playlistId");
    this.goToHome();
  }

  logout() {
    this.authService.logout();
  }
}
