import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Renderer2,
  viewChild,
} from '@angular/core';
import { IGameSettings, RandomizerService } from './randomizer.service';
import { fromEvent, take, tap } from 'rxjs';
import { WINDOW } from '../../../core/injection-tokens';
import {
  calculateTickerAnimationData,
  selectPrize,
  spinertia,
} from './helpers';

@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrl: './randomizer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomizerComponent {
  private readonly window = inject(WINDOW);
  private readonly randomizerService = inject(RandomizerService);
  private readonly renderer = inject(Renderer2);

  private tickerAnimationId!: number;

  private readonly SpinClass = 'is-spinning';
  private readonly SelectedClass = 'selected';

  private readonly wheelRef = viewChild<ElementRef>('dealWheel');
  private readonly spinnerRef = viewChild<ElementRef>('spinner');
  private readonly tickerRef = viewChild<ElementRef>('ticker');

  private readonly wheelElem = computed<HTMLDivElement>(
    () => this.wheelRef()?.nativeElement
  );
  private readonly spinnerElem = computed<HTMLUListElement>(
    () => this.spinnerRef()?.nativeElement
  );
  private readonly tickerElem = computed<HTMLDivElement>(
    () => this.tickerRef()?.nativeElement
  );

  private readonly spinnerStyles = computed<CSSStyleDeclaration>(() =>
    this.window.getComputedStyle(this.spinnerElem())
  );

  private readonly startEffect = effect(() => {
    const gameSettings = this.randomizerService.gameSettings();
    this.startGame(gameSettings);
  });

  private startGame(gameSettings: IGameSettings): void {
    const prizeNodes = this.drawSections(gameSettings);
    this.stylishSpinner(gameSettings);

    setTimeout(() => {
      this.runTheWheel(gameSettings, prizeNodes);
    }, 1000);
  }

  private stylishSpinner(gameSettings: IGameSettings) {
    this.renderer.setStyle(
      this.spinnerElem(),
      'background',
      `conic-gradient(
    from -90deg,
    ${gameSettings.prizes
      .map(
        ({ color }, i) =>
          `${color} 0 ${
            (100 / gameSettings.prizes.length) *
            (gameSettings.prizes.length - i)
          }%`
      )
      .reverse()}
  )`
    );
  }

  private drawSections(gameSettings: IGameSettings) {
    return gameSettings.prizes.reduce<HTMLLIElement[]>(
      (nodes, { text, color }, i) => {
        // каждой из них назначаем свой угол поворота
        const rotation =
          gameSettings.prizeSlice * i * -1 - gameSettings.prizeOffset;
        // добавляем код с размещением текста на страницу в конец блока spinner

        const li: HTMLLIElement = this.renderer.createElement('li');
        this.renderer.addClass(li, 'prize');
        this.renderer.setAttribute(li, 'style', `--rotate: ${rotation}deg`);

        const span: HTMLSpanElement = this.renderer.createElement('span');
        this.renderer.addClass(span, 'text');
        this.renderer.appendChild(li, span);

        const textNode = this.renderer.createText(text);
        this.renderer.appendChild(span, textNode);

        this.renderer.appendChild(this.spinnerElem(), li);

        nodes.push(li);
        return nodes;
      },
      []
    );
  }

  private runTheWheel(
    gameSettings: IGameSettings,
    prizeNodes: HTMLLIElement[]
  ) {
    const rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));

    this.renderer.addClass(this.wheelElem(), this.SpinClass);
    this.spinnerElem().style.setProperty('--rotate', String(rotation));

    this.onAnimationEndEffect({ gameSettings, rotation, prizeNodes });

    this.renderer.setStyle(this.tickerElem(), 'animation', 'none');

    this.runTickerAnimation(gameSettings);
  }

  private onAnimationEndEffect({
    gameSettings,
    prizeNodes,
    rotation,
  }: {
    gameSettings: IGameSettings;
    rotation: number;
    prizeNodes: HTMLLIElement[];
  }) {
    fromEvent(this.spinnerElem(), 'transitionend')
      .pipe(
        take(1),
        tap({
          next: () => {
            const selected = selectPrize({
              gameSettings,
              rotation,
            });

            this.renderer.addClass(prizeNodes[selected], this.SelectedClass);
          },
          finalize: () => cancelAnimationFrame(this.tickerAnimationId),
        })
      )
      .subscribe();
  }

  private runTickerAnimation(
    gameSettings: IGameSettings,
    currentSlice: number | null = null
  ) {
    const { slice } = calculateTickerAnimationData({
      gameSettings,
      spinnerTransformStyles: this.spinnerStyles().transform,
    });

    /**
     * анимация язычка, когда его задевает колесо при вращении
     * если появился новый сектор
     */
    if (currentSlice !== slice) {
      this.renderer.setStyle(this.tickerElem(), 'animation', 'none');

      setTimeout(() => {
        (this.tickerElem().style.animation as any) = null;
      }, 10);

      currentSlice = slice;
    }

    this.tickerAnimationId = requestAnimationFrame(
      this.runTickerAnimation.bind(this, gameSettings, currentSlice)
    );
  }
}
