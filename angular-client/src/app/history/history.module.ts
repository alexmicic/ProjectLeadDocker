import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history.component';
import { FormsModule } from '@angular/forms';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [HistoryComponent],
  providers: []
})
export class HistoryModule { }
