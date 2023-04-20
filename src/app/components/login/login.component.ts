import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  toSpotifyLogin(): void {
    // this.authService.getLoginUrl().subscribe(login => {
    //   localStorage.setItem('state', login.state);
    //   window.location.href = login.url;
    // });
    this.authService.test().subscribe(obj => console.log(obj));
  }
}
