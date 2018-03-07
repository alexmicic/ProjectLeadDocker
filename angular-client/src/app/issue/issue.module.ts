import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IssueComponent } from './issue.component';
import { IssueListComponent } from './issue-list/issue-list.component';
import { IssueAddComponent } from './issue-add/issue-add.component';
import { FormsModule } from '@angular/forms';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IssueService } from './issue.service';

import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    QuillModule
  ],
  declarations: [IssueComponent, IssueListComponent, IssueAddComponent],
  providers: [IssueService]
})
export class IssueModule { }
