import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  readonly data = inject(MAT_DIALOG_DATA);
}
