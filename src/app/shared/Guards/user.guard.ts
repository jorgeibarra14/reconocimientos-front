import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from "../../services/auth.service";
@Injectable()
export class UserGuard implements CanActivate {
    constructor(private authService: AuthService) { }
    canActivate(): boolean {
      const user = this.authService.getCookieUser();
      const userIsAuthenticated = !(!user || (user && (user.exp > Date.now())));
      if (!userIsAuthenticated) {
        this.authService.deleteCookie();
        window.location.href = environment.Itgov;
        return false;
      }
      return userIsAuthenticated;
    }
}
