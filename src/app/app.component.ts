import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramWebApp } from '@m1cron-labs/ng-telegram-mini-app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  // private readonly telegram = inject(TelegramWebApp);

  constructor() {
    // this.telegram.ready();
  }

  ngOnInit() {
    // console.debug('Telegram Web App is ready', this.telegram.initDataUnsafe);
  }

  ngOnDestroy(): void {
    // this.telegram.close();
  }
}
