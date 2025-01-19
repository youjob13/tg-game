import { Routes } from '@angular/router';
import { LobbyComponent } from '../lobby/lobby.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LobbyComponent,
  },
  {
    path: 'randomizer',
    loadComponent: () =>
      import('../games/randomizer/randomizer.component').then(
        (c) => c.RandomizerComponent
      ),
  },
];
