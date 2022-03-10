import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UsuariosRolesService } from "../../services/usuarios-roles.service";
import { AuthService } from "../../services/auth.service";
@Injectable()
export class AdminStoreGuard implements CanActivate {
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
        //Sólo administrador
        this.usuariosRolesService.getUsuarioRol(user.Id).subscribe(resp=>{
            /**
             * FALTA DEFINIR EL ID QUE SERÁ PARA EL ADMIN DE TIENDA
             * 3 = sólo tienda
             * 4 = tienda y admin normal
             */
            if(resp != 3 && resp != 4 && resp != 1){
                this.router.navigate(['/Inicio']);
                return false;
            }
        });
        return userIsAuthenticated;
    }
}
