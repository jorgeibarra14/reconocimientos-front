import { Component, OnInit } from '@angular/core';
import { UsuariosRolesService } from "../../services/usuarios-roles.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'ho1a-Admin-Menu',
    templateUrl: './Menu.component.html',
    styleUrls: ['./Menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
    user: any;
    accesoAdmin: boolean = false;

    constructor(
        private usuariosRolesService: UsuariosRolesService,
        private authService: AuthService
    ){}
    ngOnInit(){
        this.user = this.authService.getCookieUser();
        //Revisar si es admin
        this.usuariosRolesService.getUsuarioRol(this.user.Id).subscribe(resp=>{
            if(resp == 1 || resp == 4){
                this.accesoAdmin = true;
            }
        });
    }
}