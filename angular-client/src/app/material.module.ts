import { NgModule } from '@angular/core';
import { CustomDateAdapter } from './custom-date-adapter';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatGridListModule,
  MatDividerModule,
  MatListModule,
  MatDialogModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatDatepickerModule,
  DateAdapter,
  MatExpansionModule,
  MatChipsModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTableModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTableModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class MaterialModule {}