import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

import { environment } from '../../environments/environment';

const ENV_cookieUser = environment.cookieUser;

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService,
  ) { }

  setToken(token: string) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  getToken(): string {
    if(this.cookieService.check( ENV_cookieUser )){
      return this.cookieService.get(ENV_cookieUser);
    }
    return null;
    // return this.jwtHelper.tokenGetter();
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }
}
