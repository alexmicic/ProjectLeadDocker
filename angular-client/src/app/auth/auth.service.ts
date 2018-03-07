import { tokenNotExpired } from 'angular2-jwt';

export class Auth {
  loggedIn() {
    return tokenNotExpired();
  }

  isAdmin() {
    let isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== null && isAdmin == 'true' ) {
      return true;
    } else {
      return false;
    }
  }

  getUserId() {
    let userId = localStorage.getItem('userId');
    if (userId !== null) {
      return userId;
    } else {
      return '';
    }
  }

  getUserFullName() {
    let userFullName = localStorage.getItem('userFullName');
    if (userFullName !== null) {
      return userFullName;
    } else {
      return '';
    }
  }
}
