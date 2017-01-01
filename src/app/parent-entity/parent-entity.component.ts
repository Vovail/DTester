import {Component} from "@angular/core";
import {CRUDService} from "../shared/services/crud.service";
import {CommonService} from "../shared/services/common.service";
import {ConfigTableData} from "../shared/classes";
import {badDownloadDataMessage, badDeleteDataMessage} from "../shared/constant"

@Component({})
export class ParentEntityComponent {
    public entityData: ConfigTableData[] = [];
    public entityDataLength: number;
    public entity: string = "";
    public limit: number = 5;
    public search: string = "";
    public page: number = 1;
    public offset: number = 0;
    public loader: boolean = true;

    constructor(protected crudService: CRUDService,
                protected commonService: CommonService) {
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.offset = 0;
        this.page = 1;
        this.getRecordsRange();
    };

    pageChange(num: number) {
        if (!num) {
            this.page = 1;
            return;
        }
        this.page = num;
        this.offset = (this.page - 1) * this.limit;
        this.getRecordsRange();
    };

    getCountRecords() {
        this.crudService.getCountRecords(this.entity)
            .subscribe(
                data => {
                    this.entityDataLength = +data.numberOfRecords;
                    this.getRecordsRange();
                },
                () => {
                    this.commonService.openModalInfo(badDownloadDataMessage);
                    this.loader = false;
                }
            );
    };

    createTableConfig = (data) => {
    };

    getRecordsRange() {
        this.crudService.getRecordsRange(this.entity, this.limit, this.offset)
            .subscribe(
                data => {
                    this.createTableConfig(data);
                    this.loader = false;
                },
                () => {
                    this.commonService.openModalInfo(badDownloadDataMessage);
                    this.loader = false;
                });
    };

    delRecord = function (entity: string, id: number) {
        this.offset = (this.page - 1) * this.limit;
        this.crudService.delRecord(entity, id)
            .subscribe(() => {
                    this.commonService.openModalInfo(`Видалення пройшло успішно.`);
                    this.refreshData("delete");
                },
                () => {
                    this.commonService.openModalInfo(badDeleteDataMessage);
                    this.loader = false;
                });
    };

    findEntity(searchTerm: string) {
        if (this.loader === false) {
            this.loader = true;
        }
        this.search = searchTerm;
        if (this.search.length === 0) {
            this.offset = 0;
            this.page = 1;
            this.getCountRecords();
            return;
        }
        this.crudService.getRecordsBySearch(this.entity, this.search)
            .subscribe(data => {
                if (this.loader) {
                    this.loader = false;
                }
                if (data.response === "no records") {
                    this.entityData = [];
                    return;
                }
                this.page = 1;
                this.createTableConfig(data);
            }, () => {
                this.commonService.openModalInfo(badDownloadDataMessage);
                this.loader = false;
            });
    };

    refreshData(action: string) {
        if (action === "delete" && this.entityData.length === 1 && this.entityDataLength > 1) {
            this.offset = (this.page - 2) * this.limit;
            this.page -= 1;
        } else if (this.entityData.length > 1) {
            this.offset = (this.page - 1) * this.limit;
        }

        this.getCountRecords();
    };
}