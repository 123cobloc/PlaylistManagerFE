import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent {

  code!: string;
  state!: string;
  private subscriptions: Array<Subscription> = [];

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.state = params['state'];
    }));
    if (this.state === localStorage.getItem('state')) {
      this.subscriptions.push(this.authService.getToken(this.code).subscribe(token => {
        localStorage.removeItem('state');
        this.authService.accessToken = token.accessToken;
        this.authService.refreshToken = token.refreshToken;
        this.authService.expires = token.expires;
      }));
    }
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
