import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IMember } from '../game/game.models';

const members = [
  { id: '123', name: 'Danil', isReady: false },
  { id: '2', name: 'Katya', isReady: true },
  { id: '3', name: 'Aleh', isReady: true },
  { id: '4', name: 'Anna', isReady: true },
];

@Injectable({
  providedIn: 'root',
})
export class LobbyHttpService {
  loadData(): Observable<{ members: IMember[] }> {
    return of({ members });
  }
}
