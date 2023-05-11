import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {PlatformModule} from '@angular/cdk/platform';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TokenComponent } from './components/token/token.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CurrentTrackComponent } from './components/current-track/current-track.component';
import { FirstAccessComponent } from './components/first-access/first-access.component';
import { FormsModule } from '@angular/forms';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { WatchlistListComponent } from './components/watchlist-list/watchlist-list.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TokenComponent,
    CurrentTrackComponent,
    FirstAccessComponent,
    WatchlistComponent,
    WatchlistListComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlatformModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
