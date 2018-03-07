import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from './project.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  declarations: [ProjectComponent, ProjectAddComponent],
  providers: [ProjectService]
})
export class ProjectModule { }
