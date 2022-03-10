import { ColaboradoresService } from './../services/colaboradores.service';
import { Component, OnInit } from '@angular/core';
import { UsuariosRolesService } from "../services/usuarios-roles.service";
import { NotificacionesService } from "../services/notificaciones.service";
import { ReconocimientosService } from "../services/reconocimientos.service";
import { AuthService } from "../services/auth.service";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-TopMenu',
  templateUrl: './TopMenu.component.html',
  styleUrls: ['./TopMenu.component.scss']
})
export class TopMenuComponent implements OnInit {

  user: any = {
    Nombre: "",
    Id: 0,
    Foto:""
  };
  company: any = {
    color: "",
    isoLogo: "",
    logo: "",
    name: "",
    prefix: ""
  };
  show: boolean = false;
  accesoAdmin: boolean = false;
  /**
   * Se obtienen los últimos 5 notificaciones de la base de datos
   * El conteo es de los mensajes no leídos
  */
  notificaciones = {
    notificaciones: [ ],
    conteoNoLeidos: 0
  };

  constructor(
    private usuariosRolesService: UsuariosRolesService,
    private notificacionesService: NotificacionesService,
    private reconocimientosService: ReconocimientosService,
    private authService: AuthService,
    private colaboradorService: ColaboradoresService
  ) {
    console.log("ENV_cookieUser");
    const user = this.authService.getCookieUser();
    if(user != undefined) {
      this.colaboradorService.getUserCompany(user.Id).subscribe(r => {
        this.company = r;
      });
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.user = this.authService.getCookieUser();
      //console.log("entra a settimeout TopMenu");
      if(this.user != null){
        // this.reconocimientosService.getEmpleadosPorId(this.user.Id).subscribe(resp=>{
          //this.user.Foto = resp[0].foto;
          // console.log( "Foto: "+resp[0].foto );
        // });
        //Revisar si es admin o RH
        this.usuariosRolesService.getUsuarioRol(this.user.Id).subscribe(resp=>{
          if(resp == 1 || resp == 2){
            this.accesoAdmin = true;
          }
        });
        //Obtener notificaciones
        this.notificacionesService.getNotificaciones(this.user.Id).subscribe(resp=>{
          this.notificaciones.notificaciones = resp;
          this.notificaciones.conteoNoLeidos = resp.length;
          if(this.notificaciones.conteoNoLeidos > 0){
            this.show = true;
          }
        });
        return;
      }
    }, 500);
  }
  verNotificaciones(){
    /**
     * Cuando se leen los mensajes se llama al backend para determinar que
     * las notificaciones ya se leyeron, si todo va bien, se pone en 0 el conteo
     * y no se muestra
     */
    if(true){
      this.show = false;
      this.notificaciones.conteoNoLeidos = 0;
    }
  }

  cerrarSesion(){
    this.authService.deleteCookie();
    window.location.href = environment.Itgov;
  }
}
