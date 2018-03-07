import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprintComponent } from './sprint.component';
import { SprintService } from './sprint.service';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SprintAddComponent } from './sprint-add/sprint-add.component';
import { IssuefilterPipe } from '../filters/issuefilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    DragulaModule
  ],
  declarations: [SprintComponent, SprintAddComponent, IssuefilterPipe],
  providers: [SprintService]
})
export class SprintModule { }
