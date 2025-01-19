import { computed, effect, inject, Injectable } from '@angular/core';
import { IMember, IPlayer } from '../../game/game.models';
import { GameService } from '../../game/game.service';

export interface IGameSettings {
  prizes: { text: string; color: string }[];
  prizeSlice: number;
  prizeOffset: number;
}

@Injectable({
  providedIn: 'root',
})
export class RandomizerService {
  private readonly gameService = inject(GameService);

  readonly gameSettings = computed<IGameSettings>(() => {
    const players = this.gameService.state.players();

    const prizes = players.map((v, i) => ({
      text: v.name,
      color: i === 0 ? 'red' : i === 1 ? 'yellow' : i === 2 ? 'blue' : 'gray',
    }));

    const prizeSlice = 360 / prizes.length;

    const prizeOffset = Math.floor(180 / prizes.length);

    return {
      prizes,
      prizeSlice,
      prizeOffset,
    };
  });
}
