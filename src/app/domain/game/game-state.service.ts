import { Injectable } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { IMember, IPlayer } from './game.models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

interface IGameState {
  players: IPlayer[];
}

const initialState: IGameState = {
  players: [],
};

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  readonly state = signalState<IGameState>(initialState);

  readonly addPlayers = rxMethod<IMember[]>(
    pipe(tap((members) => patchState(this.state, { players: members })))
  );
}
