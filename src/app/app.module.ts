import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { JwtModule } from "@auth0/angular-jwt";
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AuthInterceptor } from './shared/Interceptors/auth.interceptor'
//
import { LoginComponent } from './Login/Login.component';
import { InicioComponent } from './Inicio/Inicio.component';
import { TopMenuComponent } from './TopMenu/TopMenu.component';
import { LoadingComponent } from "./components/Loading/Loading.component";
import { AvatarComponent } from './components/avatar/avatar.component';
import { ReconocerAOtrosComponent } from "./ReconocerAOtros/ReconocerAOtros.component";
import { EnviarReconocimientoComponent } from "./ReconocerAOtros/EnviarReconocimiento/EnviarReconocimiento.component";
import { MisReconocimientosComponent } from "./MisReconocimientos/MisReconocimientos.component";
import { BloqueCompetenciasComponent } from "./components/BloqueCompetencias/BloqueCompetencias.component";
import { BloquePersonasComponent } from "./components/BloquePersonas/BloquePersonas.component";
//Admin
import { AdminInicioComponent } from "./Administrador/Inicio/Inicio.component";
import { AdminMenuComponent } from "./Administrador/Menu/Menu.component";
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalAdminReconocimientosComponent } from "./components/ModalAdminReconocimientos/ModalAdminReconocimientos.component";
import { ModalAdminEditarCompetencias } from "./components/ModalAdminEditarCompenencias/ModalAdminEditarCompetencias.component";
import { ModalAdminEditarPuntos } from "./components/ModalAdminEditarPuntos/ModalAdminEditarPuntos.component";
import { ModalAdminAutorizadores } from "./components/ModalAdminAutorizadores/ModalAdminAutorizadores.component";
import { AdminAutorizadoresComponent } from "./Administrador/Autorizadores/Autorizadores.component";
import { AdminConceptosPuntosComponent } from "./Administrador/Competencias/Competencias.component";
import { AdminPuntosComponent } from "./Administrador/Puntos/Puntos.component";
import { RolesUsuariosComponent } from './Administrador/rolesUsuarios/rolesUsuarios.component';
import { ModalEditarRolesUsuarios } from './Administrador/rolesUsuarios/modalEditarRolesUsuarios/modalEditarRolesUsuarios.component';
import { ModalEditarRoles } from './Administrador/rolesUsuarios/modalEditarRoles/modalEditarRoles.component';

//Store
import { CarritoStoreComponent } from './store/carrito/carrito.component';
import { ProductoStoreComponent } from './store/producto/producto.component';
import { StoreMigasComponent } from './components/store-migas/store-migas.component';
import { StoreProductGridComponent } from './components/store-product-grid/store-product-grid.component';
import { CatalogoComponent } from './store/catalogo/catalogo.component';
//AdminTienda
import { AdminInicioStoreComponent } from "./AdministrarTienda/InicioStore/InicioStore.component";
import { AdminMenuTiendaComponent } from "./AdministrarTienda/MenuAdminTienda/MenuAdminTienda.component";
import { AdminTiendaCategoriasComponent } from "./AdministrarTienda/Categorias/Categorias.component";
import { AdminTiendProductosComponent } from "./AdministrarTienda/Productos/Productos.component";
import { ModalAdminTiendaEditarCategoria } from "./AdministrarTienda/Categorias/ModalAdminTiendaEditarCategoria/ModalAdminTiendaEditarCategoria.component";
import { ModalAdminTiendaEditarProductos } from "./AdministrarTienda/Productos/ModalAdminTiendaEditarProductos/ModalAdminTiendaEditarProductos.component";
import { ModalAdminstrarPedidosComponent } from "./AdministrarTienda/InicioStore/ModalAdminstrarPedidos/ModalAdminstrarPedidos.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from "@angular/common";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSortModule } from '@angular/material/sort'
import { MatSelectModule } from '@angular/material/select';
import { getSpanishPaginatorIntl } from "./shared/Languages/es-paginator-intl";
import { CookieService } from "ngx-cookie-service";
import { MisPedidosComponent } from './store/mis-pedidos/mis-pedidos.component';

import { LOCALE_ID, } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { MaterialModule } from 'src/app/material.module'


registerLocaleData(localeEsAr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    TopMenuComponent,
    LoadingComponent,
    AvatarComponent,
    ReconocerAOtrosComponent,
    EnviarReconocimientoComponent,
    MisReconocimientosComponent,
    BloqueCompetenciasComponent,
    BloquePersonasComponent,
    AdminInicioComponent,
    AdminMenuComponent,
    ModalAdminReconocimientosComponent,
    ModalAdminEditarCompetencias,
    ModalAdminEditarPuntos,
    ModalAdminAutorizadores,
    AdminAutorizadoresComponent,
    AdminConceptosPuntosComponent,
    AdminMenuTiendaComponent,
    AdminInicioStoreComponent,
    AdminTiendaCategoriasComponent,
    AdminTiendProductosComponent,
    ModalAdminTiendaEditarCategoria,
    ModalAdminTiendaEditarProductos,
    ModalAdminstrarPedidosComponent,
    AdminPuntosComponent,
    CarritoStoreComponent,
    ProductoStoreComponent,
    StoreMigasComponent,
    StoreProductGridComponent,
    CatalogoComponent,
    MisPedidosComponent,
    RolesUsuariosComponent,
    ModalEditarRolesUsuarios,
    ModalEditarRoles,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropDownsModule,
    MaterialModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    GridModule,
    ExcelModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function(){
          return localStorage.getItem("access_token");
        },
        allowedDomains: ['localhost:4210', 'reconocimientos.ho1a.com','reconocimientos-api.ho1a.com'],
        disallowedRoutes: [],
      }
    })
  ],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
