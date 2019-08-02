import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { listChanges } from 'angularfire2/database';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { DepartmentService } from 'src/app/shared/department.service';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  searchKey:string;

  constructor(private employeeservice: EmployeeService,
              private deparmnetservice: DepartmentService,
              private dialog: MatDialog,
              private notificationservice: NotificationService,
              private dialogservice: DialogService) { }

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['fullName','email','mobile','city','departmentName','actions'];
  @ViewChild(MatSort) sort : MatSort;
  @ViewChild(MatPaginator) paginator : MatPaginator;
  

  ngOnInit() {
    this.employeeservice.getEmployees().subscribe(
      list => {
        let array = list.map(item => {
          let departmentName = this.deparmnetservice.getDepartmentName(item.payload.val()['department']);
          return {
            $key: item.key,
            departmentName,
            ...item.payload.val()
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.listData.filterPredicate = (data,filter) => {
          return this.displayedColumns.some(ele => {
            return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
          });
        };
      });
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onCreate(){
    this.employeeservice.initializeFormGroup();
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%"
    this.dialog.open(EmployeeComponent,dialogconfig);
  }

  onEdit(row){
    this.employeeservice.populateForm(row);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%"
    this.dialog.open(EmployeeComponent,dialogconfig);
  }

  onDelete($key){
    // if(confirm('Are you sure to delete this record?')){
    //   this.employeeservice.deleteEmployee($key);
    //   this.notificationservice.warn("! Deleted Successfully");
    // }

    this.dialogservice.openConfirmDialog('Are you sure to delete this record?');
  }

}
