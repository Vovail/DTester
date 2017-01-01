import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {
    Faculty,
    ConfigModalAddEdit,
    ConfigTableHeader,
    ConfigTableAction,
    ConfigModalInfo,
    ConfigTableData
} from "../shared/classes";

import {CRUDService} from "../shared/services/crud.service";
import {
    configAddFaculty, configEditFaculty, modalInfoConfig,
    maxSize,
    headersFaculty, actionsFaculty,
    addTitle, searchTitle, entityTitle, selectLimitTitle, nothingWasChange
} from "../shared/constant";
import {CommonService} from "../shared/services/common.service";
import {ParentEntityComponent} from "../parent-entity/parent-entity.component";


@Component({
    templateUrl: "faculty.component.html"
})
export class FacultyComponent extends ParentEntityComponent implements OnInit {

    public modalInfoConfig: ConfigModalInfo = modalInfoConfig;
    public configAdd: ConfigModalAddEdit = configAddFaculty;
    public configEdit: ConfigModalAddEdit = configEditFaculty;
    public paginationSize: number = maxSize;
    public headers: ConfigTableHeader[] = headersFaculty;
    public actions: ConfigTableAction[] = actionsFaculty;
    public addTitle: string = addTitle;
    public searchTitle: string = searchTitle;
    public entityTitle: string = entityTitle;
    public selectLimitTitle: string = selectLimitTitle;
    public entity: string = "faculty";
    public nothingWasChange: string[] = nothingWasChange;

    constructor(protected crudService: CRUDService,
                private _router: Router,
                protected commonService: CommonService) {
        super(crudService, commonService);
    };

    ngOnInit() {
        this.getCountRecords();
    }

    createTableConfig = (data: Faculty[]) => {
        let numberOfOrder: number;
        this.entityData = data.map((item, i) => {
            numberOfOrder = i + 1 + (this.page - 1) * this.limit;
            let faculty: any = {};
            faculty.entity_id = item.faculty_id + "";
            faculty.entityColumns = [numberOfOrder,
                this.commonService.convertToHtml(item.faculty_name),
                this.commonService.convertToHtml(item.faculty_description)];
            return <ConfigTableData>faculty;
        });
    };

    activate(data: ConfigTableData) {
        const run = {
            group: this.groupCase,
            create: this.createCase,
            edit: this.editCase,
            delete: this.deleteCase
        };

        run[data.action](data);
    }

    groupCase = (data: ConfigTableData) => {
        this._router.navigate(
            ["/admin/group/byFaculty"],
            {queryParams: {facultyId: data.entity_id}});
    };

    createCase = (data?: ConfigTableData) => {
        this.configAdd.list.forEach((item) => {
            item.value = "";
        });
        this.commonService.openModalAddEdit(this.configAdd)
            .then((data: ConfigModalAddEdit) => {
                    const newFaculty: Faculty = new Faculty(data.list[0].value, data.list[1].value);
                    this.crudService.insertData(this.entity, newFaculty)
                        .subscribe(() => {
                            this.commonService.openModalInfo(`${data.list[0].value} успішно створено`);
                            this.refreshData(data.action);
                        }, this.errorAddEdit);
                },
                this.handleReject);
    };

    editCase = (data: ConfigTableData) => {
        this.configEdit.list.forEach((item, i) => {
            item.value = data.entityColumns[i + 1];
        });
        this.configEdit.id = data.entity_id;
        const list = JSON.stringify(this.configEdit.list);
        this.commonService.openModalAddEdit(this.configEdit)
            .then((configData: ConfigModalAddEdit) => {
                    const newList = JSON.stringify(configData.list);
                    if (list === newList) {
                        this.commonService.openModalInfo(...nothingWasChange)
                            .then(() => {
                                this.editCase(data);
                            }, this.handleReject);
                    } else {
                        const editedFaculty: Faculty = new Faculty(configData.list[0].value, configData.list[1].value);
                        this.crudService.updateData(this.entity, +configData.id, editedFaculty)
                            .subscribe(() => {
                                this.commonService.openModalInfo(`Редагування пройшло успішно`);
                                this.refreshData(configData.action);
                            }, this.errorAddEdit);
                    }
                },
                this.handleReject);
    };

    deleteCase = (data: ConfigTableData) => {
        const message: string[] = [`Ви дійсно хочете видалити ${data.entityColumns[1]}?`, "confirm", "Попередження!"];
        this.commonService.openModalInfo(...message)
            .then(() => {
                    this.delRecord(this.entity, +data.entity_id);
                },
                this.handleReject);
    };

    errorAddEdit = (error) => {
        let message: string;
        if (error === "400 - Bad Request") {
            message = `Факультет з такою назвою вже існує`;
        } else {
            message = "Невідома помилка! Зверніться до адміністратора.";
        }
        this.commonService.openModalInfo(message);
    };

    handleReject = () => {
    };
}