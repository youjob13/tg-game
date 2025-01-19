import { inject, Injectable } from '@angular/core';
import { IMember } from './game.models';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly gameStateService = inject(GameStateService);

  readonly state = this.gameStateService.state;

  addPlayers(members: IMember[]) {
    this.gameStateService.addPlayers(members);
  }
}
