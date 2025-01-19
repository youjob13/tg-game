import { Routes } from '@angular/router';
import { MenuComponent } from './domain/menu/menu.component';
import { routes as gameRoutes } from './domain/game/game.routes';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./domain/game/game.component').then((c) => c.GameComponent),
    children: gameRoutes,
  },
];
