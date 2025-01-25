import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './form-modal.component.scss',
})
export class FormModalComponent {
  readonly dialogRef = inject(MatDialogRef<FormModalComponent>);
  readonly userName = model();

  onNoClick(): void {
    this.dialogRef.close();
  }
}
