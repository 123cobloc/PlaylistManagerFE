import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ItemType } from 'src/app/models/item-type.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent {

  constructor(private router: Router) { }

  itemTypes: any = Object.keys(ItemType).filter(k => typeof ItemType[k as any] === "number");

  goToHome() {
    this.router.navigate(['/']);
  }

  goTo(itemType: ItemType) {
    this.router.navigate([`/watchlist/list`], { queryParams: { itemType: ItemType[itemType] } });
  }

}
