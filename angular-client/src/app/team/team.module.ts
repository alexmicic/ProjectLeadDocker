import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { TeamAddComponent } from './team-add/team-add.component';
import { TeamService } from './team.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  declarations: [TeamComponent, TeamAddComponent],
  providers: [TeamService]
})
export class TeamModule { }
