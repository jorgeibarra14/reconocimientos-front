import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UsuariosRolesService } from "../../services/usuarios-roles.service";
import { AuthService } from "../../services/auth.service";
@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private router: Router,
                private usuariosRolesService: UsuariosRolesService,
                private authService: AuthService
    ) { }

    canActivate(): boolean {
      const user = this.authService.getCookieUser();
      const userIsAuthenticated = !(!user || (user && (user.exp > Date.now())));
      if (!userIsAuthenticated) {
        this.authService.deleteCookie();
        window.location.href = environment.Itgov;
        return false;
      }
      /**
       * 1 = sólo admin general, no tienda
       * 4 = admin general + tienda
       */
      this.usuariosRolesService.getUsuarioRol(user.Id).subscribe(resp=>{
        if(resp != 1 && resp != 4){
          this.router.navigate(['/Inicio']);
          return false;
        }
      });
      return userIsAuthenticated;
    }
}
