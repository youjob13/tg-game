import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  loading = false;
  counter = 0;
  mockMembers = new BehaviorSubject<{ members: IMember[] }>({ members: [] });

  addMockUser() {
    setTimeout(() => {
      this.mockMembers.next({
        members: [
          ...this.mockMembers.value.members,
          { ...members[this.counter] },
        ],
      });
      this.counter += 1;

      if (this.counter < 4) {
        this.addMockUser();
      } else {
        this.mockMembers.complete();
      }
    }, 1000);
  }

  loadData(): Observable<{ members: IMember[] }> {
    this.addMockUser();

    return this.mockMembers.asObservable();
  }
}
