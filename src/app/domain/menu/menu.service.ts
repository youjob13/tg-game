import { inject, Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly userService = inject(UserService);
}
