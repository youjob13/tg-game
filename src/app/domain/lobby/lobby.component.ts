import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { LobbyFacadeService } from './lobby-facade.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-lobby',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly lobbyFacadeService = inject(LobbyFacadeService);
  readonly gameService = inject(GameService);

  readonly members = computed(() => this.lobbyFacadeService.state.members());
  readonly fulfillmentProgress = computed(() => {
    const readinessMembers = this.lobbyFacadeService.state
      .members()
      .filter((member) => member.isReady);

    return (
      (readinessMembers.length /
        untracked(this.lobbyFacadeService.state.gameRequirementMembersCount)) *
      100
    );
  });
  readonly isLobbyFulled = computed(
    () =>
      this.lobbyFacadeService.state.members().length ===
      untracked(this.lobbyFacadeService.state.gameRequirementMembersCount)
  );
  readonly lobbySettings = signal({
    cols: 2,
  });

  ngOnInit(): void {
    this.lobbyFacadeService.loadData();
  }

  navigateToGame() {
    this.gameService.addPlayers(this.members());
    this.lobbyFacadeService.clearState();
    this.router.navigate(['randomizer'], { relativeTo: this.route });
  }

  changeReadinessStatus() {
    this.lobbyFacadeService.changeReadinessStatus();
  }
}
