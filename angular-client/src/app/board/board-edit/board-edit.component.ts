import { Component, OnInit, Inject } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Board } from '../board.component';
import { IssueService } from '../../issue/issue.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.css']
})
export class BoardEditComponent implements OnInit {
  errorMessage: string;
  msg: string;
  board: Board;
  columns: [string];

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<BoardEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public issueService: IssueService
  ) { }

  ngOnInit() {
    this.getBoard();
    this.columns = ['OPEN', 'IN PROGRESS', 'BLOCKED', 'AWAITING REVIEW', 'IN REVIEW', 'QA TESTING', 'PO TESTING', 'DONE'];
  }
  
  close() {
    this.dialogRef.close();
  }

  getBoard() {
    this.boardService.getBoard(this.data.boardId)
                      .subscribe(
                        board => this.board = board,
                        error =>  this.errorMessage = <any>error);
  }

  save() {
    this.boardService.updateBoard(this.data.boardId, this.board)
                    .subscribe(
                      next => {
                        this.issueService.resetIssuesForBoard(this.data.boardId)
                                          .subscribe(
                                            next => this.close(),
                                            error =>  this.errorMessage = <any>error);
                      },
                      error =>  this.errorMessage = <any>error);
  }

}
