import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { IMember } from '../game/game.models';
import { patchState, signalState } from '@ngrx/signals';
import { initialLobbyState } from './state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { LobbyHttpService } from './lobby-http.service';
import { tapResponse } from '@ngrx/operators';
import { UserService } from '../services/user.service';

export enum ReadinessStatus {
  Ready = 'ready',
  NotReady = 'not_ready',
}

@Injectable({
  providedIn: 'root',
})
export class LobbyStateService {
  private readonly lobbyHttpService = inject(LobbyHttpService);
  private readonly userService = inject(UserService);
  private readonly user = this.userService.user;

  readonly state = signalState(initialLobbyState);

  readonly isReadyForGame = computed(() => {
    const members = this.state.members();

    if (members.length !== untracked(this.state.gameRequirementMembersCount)) {
      return false;
    }

    if (members.some((member) => !member.isReady)) {
      return false;
    }

    return true;
  });

  a = effect(() => console.log(this.state.members()));

  readonly changeReadinessStatus = rxMethod<void>(
    pipe(
      tap(() => {
        // ToDo: must be call to server
        patchState(this.state, (state) => {
          return {
            members: state.members.map((member) => {
              const currentUser = member.id === this.user()?.id;

              if (currentUser) {
                return {
                  ...member,
                  isReady: !member.isReady,
                };
              }

              return member;
            }),
          };
        });
      })
    )
  );

  readonly loadData = rxMethod<void>(
    pipe(
      tap(() => patchState(this.state, { isLoading: true })),
      exhaustMap(() => {
        return this.lobbyHttpService.loadData().pipe(
          tapResponse({
            next: ({ members }) => patchState(this.state, { members }),
            error: console.error,
            finalize: () => patchState(this.state, { isLoading: false }),
          })
        );
      })
    )
  );
}
