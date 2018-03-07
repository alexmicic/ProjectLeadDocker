import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

// drag and drop
import { DragulaModule } from 'ng2-dragula';

// angular material
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// auth
import { Auth } from './auth/auth.service';
import { AuthGuard, AuthGuardAdmin } from './auth/auth-guard.service';
import { AuthModule } from './auth/auth.module';

// app modules
import { ConfigModule } from './config/config.module';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProjectModule } from './project/project.module';
import { BoardModule } from './board/board.module';
import { IssueModule } from './issue/issue.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { HelpModule } from './help/help.module';
import { SprintModule } from './sprint/sprint.module';
import { HistoryModule } from './history/history.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profile.module';
import { ReportModule } from './report/report.module';

// app components
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { ProjectComponent } from './project/project.component';
import { ProjectAddComponent } from './project/project-add/project-add.component';

import { BoardContainerComponent } from './board/board-container/board-container.component';
import { BoardComponent } from './board/board.component';
import { BoardListComponent } from './board/board-list/board-list.component';
import { BoardAddComponent } from './board/board-add/board-add.component';
import { BoardEditComponent } from './board/board-edit/board-edit.component';

import { IssueComponent } from './issue/issue.component';
import { IssueListComponent } from './issue/issue-list/issue-list.component';
import { IssueAddComponent } from './issue/issue-add/issue-add.component';

import { TeamComponent } from './team/team.component';
import { TeamAddComponent } from './team/team-add/team-add.component';

import { UserContainerComponent } from './user/user-container/user-container.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserAddComponent } from './user/user-add/user-add.component';

import { HelpComponent } from './help/help.component';

import { SprintComponent } from './sprint/sprint.component';
import { SprintAddComponent } from './sprint/sprint-add/sprint-add.component';

import { HistoryComponent } from './history/history.component';

import { CommentComponent } from './comment/comment.component';

import { ProfileComponent } from './profile/profile.component';

import { ReportComponent } from './report/report.component';

const appRoutes: Routes = [
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    data: { 
      title: 'Login' 
    } 
  },
  {
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Dashboard'
    }
  },
  {
    path: 'help', 
    component: HelpComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Help'
    }
  },
  { 
    path: 'projects/add', 
    component: ProjectAddComponent,
    canActivate: [AuthGuard, AuthGuardAdmin],
    data: { 
      title: 'Add Project' 
    } 
  },
  {
    path: 'projects/:id', 
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Project'
    },
    children: [
      {path: '', redirectTo: 'boards', pathMatch: 'full'}, 
      {
        path: 'boards', 
        component: BoardContainerComponent,
        children: [
          {path: '', component: BoardListComponent}, 
          {path: ':id', component: BoardComponent,
            children: [
              // sprint routes
              {path: 'sprint', component: SprintComponent},
              {path: 'sprint/add', component: SprintAddComponent},

              // history route
              {path: 'history', component: HistoryComponent},

              // reports route
              {path: 'reports', component: ReportComponent},

              // comments route
              {path: 'comments', component: CommentComponent},

              // issue routes
              {path: '', component: IssueListComponent},
              {path: ':id', component: IssueComponent},
              {path: 'add', component: IssueAddComponent},
            ]
          }, 
          {path: 'add', component: BoardAddComponent},
          {path: 'edit', component: BoardEditComponent}
        ]
      }
    ]
  },
  { 
    path: 'teams/add', 
    component: TeamAddComponent,
    canActivate: [AuthGuard, AuthGuardAdmin],
    data: { 
      title: 'Add Team' 
    } 
  },
  {
    path: 'teams/:id', 
    component: TeamComponent,
    canActivate: [AuthGuard, AuthGuardAdmin],
    data: {
      title: 'Team'
    },
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'}, 
      {path: 'users', component: UserContainerComponent,
        children: [
          {path: '', component: UserListComponent}, 
          {path: 'add', component: UserAddComponent}
        ]
      }
    ]
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard], 
    data: { 
      title: 'Profile' 
    } 
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AuthModule,

    // drag and drop
    DragulaModule,

    // angular material
    MaterialModule,
    BrowserAnimationsModule,

    // app modules
    ConfigModule,
    LoginModule,
    DashboardModule,
    ProjectModule,
    BoardModule,
    IssueModule,
    TeamModule,
    UserModule,
    HelpModule,
    SprintModule,
    HistoryModule,
    CommentModule,
    ProfileModule,
    ReportModule,

    // core modules
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [Auth, AuthGuard, AuthGuardAdmin],
  bootstrap: [AppComponent]
})
export class AppModule { }
