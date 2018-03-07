import { Component, OnInit, Inject } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Board } from '../board.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css']
})
export class BoardAddComponent implements OnInit {
  errorMessage: string;
  msg: string;
  board: Board;
  columns: [string];

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<BoardAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.board = new Board;
    this.board.project = this.data.projectId;
    this.board.columns = ['OPEN', 'DONE'];
    this.columns = ['OPEN', 'IN PROGRESS', 'BLOCKED', 'AWAITING REVIEW', 'IN REVIEW', 'QA TESTING', 'PO TESTING', 'DONE'];
  }
  
  close() {
    this.dialogRef.close();
  }

  save() {
    this.boardService.createBoard(this.board)
                    .subscribe(
                      data => this.validate(data),
                      error =>  this.errorMessage = <any>error);
  }

  validate(data) {
    if (!data.success) {
      this.msg = data.message;
    } else {
      this.close();
    }
  }

}
