import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "dt-table",
    templateUrl: "table.component.html",
    styleUrls: ["table.component.scss"]
})
export class TableComponent {

    @Input() tableData: any;
    @Input() headers: any;
    @Input() actions: any;
    @Input() page: number;
    @Input() limit: number;
    @Output() activate = new EventEmitter();

    constructor() {
    }

    run(entityData: any, action: string) {
        entityData.action = action;
        this.activate.emit(entityData);
    }

}
