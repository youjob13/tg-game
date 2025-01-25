import { computed, inject, Injectable, untracked } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { initialLobbyState } from './state';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, tap } from 'rxjs';
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

  readonly clearState = rxMethod<void>(
    pipe(tap(() => patchState(this.state, { members: [] })))
  );

  readonly changeReadinessStatus = rxMethod<void>(
    pipe(
      tap(() => {
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

  readonly updateRequiredMembersCount = rxMethod<number>(
    pipe(
      tap((count) =>
        patchState(this.state, { gameRequirementMembersCount: count })
      )
    )
  );

  readonly addMember = rxMethod<string>(
    pipe(
      tap((newMember: string) =>
        patchState(this.state, (state) => ({
          members: [
            ...state.members,
            { id: self.crypto.randomUUID(), name: newMember, isReady: true },
          ],
        }))
      )
    )
  );

  readonly loadData = rxMethod<void>(
    pipe(
      tap(() => patchState(this.state, { isLoading: true })),
      exhaustMap(() => {
        return of({ members: [] }).pipe(
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
