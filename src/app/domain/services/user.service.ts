import { Injectable, signal } from '@angular/core';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user = signal<IUser | null>({
    id: '123',
    name: 'Danil Rodionov',
  });

  loadUser() {}
}
