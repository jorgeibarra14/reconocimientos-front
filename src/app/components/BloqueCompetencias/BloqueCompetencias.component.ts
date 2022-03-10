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
}
