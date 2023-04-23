import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Album } from 'src/app/models/album.model';
import { Artist } from 'src/app/models/artist.model';
import { ItemType } from 'src/app/models/item-type.model';
import { Track } from 'src/app/models/track.model';
import { CommonModule } from '@angular/common';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'details-modal-content',
  standalone: true,
  imports: [CommonModule],
  template: `
		<div class="modal-body rounded">
      <div class="my-header">
        <h5>{{item?.name}}</h5>
        <p style="color: #5e5e5e;">{{ itemType === 0 ? "Album" : itemType === 1 ? "Artista" : "Canzone"}}</p>
      </div>
      <div class="d-flex">
        <div class="my-half" (click)="openSpotify()">
          Apri con
          <br>
          Spotify
        </div>
        <span class="vr"></span>
        <div class="my-half" (click)="addToWatchlist()">
          Aggiungi alla
          <br>
          Watchlist
        </div>
      </div>
		</div>
	`,
})
export class DetailsModalContent {
  @Input() item: Track | Album | Artist | undefined;
  @Input() itemType: ItemType | undefined;
  private subscriptions: Array<Subscription> = [];

  constructor(private activeModal: NgbActiveModal, private watchlistService: WatchlistService) {}

  openSpotify(): void {
    if (!this.item) return;
    window.open(this.item.url, "_blank");
    this.activeModal.close();
  }

  addToWatchlist(): void {
    if (!this.item || !this.itemType) return;
    this.subscriptions.push(this.watchlistService.addToWatchlist(this.item.id, this.itemType).subscribe(() => this.activeModal.close()));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss']
})
export class DetailsModalComponent {
  
  @Input() track: Track | undefined;

  constructor(private modalService: NgbModal) {}

  open(item: Track | Album | Artist | undefined): void {
    if (!item) return;
    const modalRef = this.modalService.open(DetailsModalContent, { windowClass: 'my-modal' });
    modalRef.componentInstance.item = item;
    switch (item.url.charAt(28)) {
      case 'u':
        modalRef.componentInstance.itemType = ItemType.Album;
        break;
      case 'i':
        modalRef.componentInstance.itemType = ItemType.Artist;
        break;
      case 'c':
        modalRef.componentInstance.itemType = ItemType.Track;
        break;
    }
  }

}
