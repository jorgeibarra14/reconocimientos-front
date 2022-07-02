import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ho1a-BloqueCompetencias',
    templateUrl: './BloqueCompetencias.component.html',
    styleUrls: ['./BloqueCompetencias.component.scss']
})
export class BloqueCompetenciasComponent implements OnInit {

    @Output() clickCompetencia: EventEmitter<any>;
    @Input() competencia: any;
    @Input() competencia_activa: number;

    constructor() {
        this.clickCompetencia = new EventEmitter();
    }

    ngOnInit() { }

    filtrar(id){
        this.clickCompetencia.emit(id);
    }

  setColor (competencia) {
    let color = 'card text-center default ';

    if (competencia.nombre === this.competencia_activa) {
        color += 'active';
      }
    switch (competencia.id_competencia) {
      case 1:
        color = 'card text-center cyan';
        break;
      case 2:
        color = 'card text-center blue';
        break;
      case 3:
        color = 'card text-center red';
        break;
      case 4:
        color = 'card text-center orange';
        break;
      default:
        color = 'card text-center default';
        break;
    }
    return color;
    }
}
