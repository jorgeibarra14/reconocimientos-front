import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef  } from '@angular/core';

@Component({
    selector: 'ho1a-BloquePersonas',
    templateUrl: './BloquePersonas.component.html',
    styleUrls: ['./BloquePersonas.component.scss']
})
export class BloquePersonasComponent implements OnInit, AfterViewInit {
    @Input() persona: any;
    @Input() type: any;
    @ViewChild('textMotivo') textMotivo: ElementRef;

    hidden: boolean = true;
    show: boolean = true;

    constructor() { }

    ngOnInit() { }
    ngAfterViewInit() {
        //Ocultar si los textos son cortos
        setTimeout(() => {
            if(this.textMotivo.nativeElement.scrollHeight <= 40){
                this.show = false;
            }
        });
    }

}
