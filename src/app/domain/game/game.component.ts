import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LobbyComponent } from '../lobby/lobby.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [RouterOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {}
