import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UsuariosRolesService } from "../../services/usuarios-roles.service";
import { AuthService } from "../../services/auth.service";
@Injectable()
export class RhAdminGuard implements CanActivate {
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
        //RH Y ADMIN
        this.usuariosRolesService.getUsuarioRol(user.Id).subscribe(resp=>{
            if(resp != 1 && resp != 2 && resp != 4){
                this.router.navigate(['/Inicio']);
                return false;
            }
        });
        return userIsAuthenticated;
    }
}
