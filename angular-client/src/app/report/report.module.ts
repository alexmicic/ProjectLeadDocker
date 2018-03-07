import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule,
    ChartsModule
  ],
  declarations: [ReportComponent],
  providers: []
})
export class ReportModule { }
