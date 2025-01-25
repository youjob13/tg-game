import { inject, Injectable } from '@angular/core';
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

  addMember(newMember: string) {
    this.lobbyStateService.addMember(newMember);
  }

  clearState() {
    this.lobbyStateService.clearState();
  }

  changeReadinessStatus() {
    this.lobbyStateService.changeReadinessStatus();
  }

  updateRequiredMembersCount(count: number) {
    this.lobbyStateService.updateRequiredMembersCount(count);
  }
}
