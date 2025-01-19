import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const WINDOW = new InjectionToken('window', {
  providedIn: 'root',
  factory() {
    const platFormId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platFormId)) {
      return window;
    }

    throw new Error('Unknown platform');
  },
});
