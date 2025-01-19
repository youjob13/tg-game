import { inject, Injectable, signal } from '@angular/core';
import { IMember } from '../game/game.models';
import { patchState, signalState } from '@ngrx/signals';
import { initialLobbyState } from './state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { LobbyHttpService } from './lobby-http.service';
import { tapResponse } from '@ngrx/operators';
import { LobbyStateService } from './lobby-state.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyFacadeService {
  private readonly lobbyStateService = inject(LobbyStateService);
  private readonly userService = inject(UserService);

  readonly state = this.lobbyStateService.state;
  readonly isReadyForGame = this.lobbyStateService.isReadyForGame;
  readonly currentUser = this.userService.user;

  loadData() {
    this.lobbyStateService.loadData();
  }

  changeReadinessStatus() {
    this.lobbyStateService.changeReadinessStatus();
  }
}
