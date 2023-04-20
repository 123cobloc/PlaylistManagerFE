import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  user: User = {} as User;
  private subscriptions: Array<Subscription> = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.getMe().subscribe(user => this.user = user));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
