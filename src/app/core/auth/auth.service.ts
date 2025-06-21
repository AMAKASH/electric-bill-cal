import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;
  private authorizationBaseURL = '';
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    //this.authorizationBaseURL = environment.api_endpoint + 'auth';
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.authorizationBaseURL}`, {
        username,
        password,
      })
      .pipe(
        tap((responseData) => {
          this.handleAuthentication(responseData);
        })
      );
  }

  attemptAutoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData') ?? '[]');
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private autoLogout(expirationDuration: number) {
    if (expirationDuration > 24 * 60 * 60 * 1000) {
      return;
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(responseData: AuthResponse) {
    const expirationDuration = 30 * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + expirationDuration);
    const user = new User(responseData.token, expirationDate);
    this.user.next(user);
    this.autoLogout(expirationDuration);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
