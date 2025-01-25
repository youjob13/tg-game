import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
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
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from '../../common/components/form-modal/form-modal.component';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-lobby',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly lobbyFacadeService = inject(LobbyFacadeService);
  readonly gameService = inject(GameService);

  readonly requiredMembersCountControl = new FormControl<number>(0, {
    validators: [Validators.min(2)],
  });

  constructor() {
    this.requiredMembersCountControl.valueChanges.subscribe((count) => {
      if (count && count > 1) {
        this.lobbyFacadeService.updateRequiredMembersCount(count);
      }
    });
  }

  readonly members = computed(() => this.lobbyFacadeService.state.members());
  readonly fulfillmentProgress = computed(() => {
    const readinessMembers = this.lobbyFacadeService.state
      .members()
      .filter((member) => member.isReady);

    return (
      (readinessMembers.length /
        this.lobbyFacadeService.state.gameRequirementMembersCount()) *
      100
    );
  });
  readonly isLobbyFulled = computed(
    () =>
      this.lobbyFacadeService.state.members().length ===
      this.lobbyFacadeService.state.gameRequirementMembersCount()
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

  addParticipant() {
    const dialogRef = this.dialog.open(FormModalComponent, {
      width: '250px',
      enterAnimationDuration: 300,
      exitAnimationDuration: 300,
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result != null) {
        this.lobbyFacadeService.addMember(result);
      }
    });
  }
}
