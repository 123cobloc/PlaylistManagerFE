import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TokenComponent } from './components/token/token.component';
import { TokenGuard } from './guards/token.guard';
import { LoginGuard } from './guards/login.guard';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { WatchlistListComponent } from './components/watchlist-list/watchlist-list.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', redirectTo: '' },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [AuthGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent, canActivate: [AuthGuard] },
  { path: 'watchlist/list', component: WatchlistListComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'callback', component: TokenComponent, canActivate: [TokenGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
