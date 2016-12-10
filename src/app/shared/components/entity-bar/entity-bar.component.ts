import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {Subject} from "rxjs";

@Component({
    selector: "entity-bar",
    templateUrl: "entity-bar.component.html",
    styleUrls: ["entity-bar.component.scss"]
})
export class EntityBarComponent implements OnInit {

    @Input() addTitle: string;
    @Input() entityTitle: string;
    @Input() searchTitle: string;
    @Input() selectLimit: string;
    @Input() entityDataLength: number;
    @Input() listOfOptions1: any[];
    @Input() listOfOptions2: any[];
    @Input() isSelectedBy: boolean;
    @Input() defaultOption1: string;
    @Input() defaultOption2: string;
    @Output() activate = new EventEmitter();
    @Output() searchRun = new EventEmitter();
    @Output() selectRun = new EventEmitter();
    @Output() sortByField1 = new EventEmitter();
    @Output() sortByField2 = new EventEmitter();
    private config: any = {action: "create"};
    private searchTerms = new Subject();

    constructor(private location: Location) {
    }

    find(term: string) {
        this.searchTerms.next(term);
    }

    ngOnInit() {
        this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(newValue => {
                this.searchRun.emit(newValue);
            });
    }

    onSelect1(data): void {
        this.sortByField1.emit(data);
    }

    onSelect2(data): void {
        this.sortByField2.emit(data);
    }

    modal(data: any) {
        this.activate.emit(data);
    }

    changeLimit(limit: number) {
        this.selectRun.emit(limit);
    }

    goBack(): void {
        this.location.back();
    }

}