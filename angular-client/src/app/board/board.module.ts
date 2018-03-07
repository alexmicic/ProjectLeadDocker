import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { RouterModule, Routes } from '@angular/router';
import { BoardAddComponent } from './board-add/board-add.component';
import { BoardEditComponent } from './board-edit/board-edit.component';
import { BoardService } from './board.service';
import { BoardListComponent } from './board-list/board-list.component';
import { FormsModule } from '@angular/forms';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardContainerComponent } from './board-container/board-container.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [BoardComponent, BoardAddComponent, BoardEditComponent, BoardListComponent, BoardContainerComponent],
  providers: [BoardService]
})
export class BoardModule { }
