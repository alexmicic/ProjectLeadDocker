import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth.service';

import { BoardService } from '../board.service';
import { Board } from '../board.component';
import { BoardAddComponent } from '../board-add/board-add.component';
import { BoardEditComponent } from '../board-edit/board-edit.component';

// angular material
import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarRef} from '@angular/material';

import firebase from '../../firebase.js';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit, OnDestroy {
  id: string;
  errorMessage: string;
  boards: Board[];
  initFirebase: boolean = false;

  constructor(
    private titleService: Title, 
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private boardService: BoardService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.parent.parent.params.subscribe( params => {
      this.id = params.id;
      this.getBoardsForProject(this.id);
    } );

    firebase.database().ref('shouldSync').on('value', (snapshot) => {
      if ( snapshot.val() 
            && snapshot.val().userId !== this.auth.getUserId() 
            &&  snapshot.val().route === this.router.url
            && this.initFirebase ) {
        let snackBarRef = this.snackBar.open('Board list is updated. Click here for a refresh.', 'REFRESH');
        snackBarRef.onAction().subscribe(() => {
          this.getBoardsForProject(this.id);
        });
      } else {
        this.getBoardsForProject(this.id);
      }

      this.initFirebase = true;
    }, (errorObject) => {
      // on error
      this.getBoardsForProject(this.id);
      console.log("The read failed: " + errorObject.code);
    });
  }

  ngOnDestroy() {
    firebase.database().ref('shouldSync').off();
  }

  getBoardsForProject(id) {
    this.boardService.getBoardsForProject(id)
                        .subscribe(
                          boards => {
                            this.boards = boards;
                          },
                          error => this.errorMessage = <any>error);
  }

  deleteBoard(id) {
    this.boardService.deleteBoard(id)
                        .subscribe(
                          next => {
                            //this.getBoardsForProject(this.id);
                            firebase.database().ref('shouldSync').set( 
                              {
                                userId: this.auth.getUserId(),
                                route: this.router.url,
                                timestamp: Date.now()
                              }
                            );
                          },
                          error => this.errorMessage = <any>error);
  }

  addBoard() {
    let dialogRef = this.dialog.open(BoardAddComponent, {
      width: '600px',
      data: { projectId: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getBoardsForProject(this.id);
      firebase.database().ref('shouldSync').set( 
        {
          userId: this.auth.getUserId(),
          route: this.router.url,
          timestamp: Date.now()
        }
      );
    });
  }

  editBoard(id) {
    let dialogRef = this.dialog.open(BoardEditComponent, {
      width: '600px',
      data: { projectId: this.id, boardId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      //this.getBoardsForProject(this.id);
      firebase.database().ref('shouldSync').set( 
        {
          userId: this.auth.getUserId(),
          route: this.router.url,
          timestamp: Date.now()
        }
      );
    });
  }

}
