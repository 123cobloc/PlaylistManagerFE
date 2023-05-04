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
import { DetailsModalComponent } from './components/details-modal/details-modal.component';
import { NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FirstAccessComponent } from './components/first-access/first-access.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TokenComponent,
    CurrentTrackComponent,
    DetailsModalComponent,
    FirstAccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlatformModule,
    NgbModalModule,
    NgbToastModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
