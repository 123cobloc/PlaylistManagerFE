import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isSupported: boolean = false; 

  constructor(private authService: AuthService, private platformLocation: PlatformLocation) { }

  ngOnInit(): void {
    if (this.platformLocation.toString().match(/Android|iPhone/i)) this.isSupported = true;
  }

  toSpotifyLogin(): void {
    this.authService.getLoginUrl().subscribe(login => {
      localStorage.setItem('state', login.state);
      window.location.href = login.url;
    });
  }
}
