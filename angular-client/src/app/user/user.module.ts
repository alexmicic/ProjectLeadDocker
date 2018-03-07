import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserContainerComponent } from './user-container/user-container.component';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// angular material
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [UserComponent, UserAddComponent, UserListComponent, UserContainerComponent],
  providers: [UserService]
})
export class UserModule { }

