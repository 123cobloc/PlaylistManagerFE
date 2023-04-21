import { Platform } from '@angular/cdk/platform';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isSupported: boolean = false; 

  constructor(private authService: AuthService, private platform: Platform) { }

  ngOnInit(): void {
    this.isSupported = true; //this.platform.ANDROID || this.platform.IOS;
  }

  toSpotifyLogin(): void {
    this.authService.getLoginUrl().subscribe(login => {
      localStorage.setItem('state', login.state);
      window.location.href = login.url;
    });
  }
}
