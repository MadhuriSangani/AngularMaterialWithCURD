import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { EmployeeService } from 'src/app/shared/employee.service';
import { DepartmentService } from 'src/app/shared/department.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private service: EmployeeService,
              private departmentservice: DepartmentService,
              private notificationservice: NotificationService,
              public dailogref: MatDialogRef<EmployeeComponent>) { }

  

  ngOnInit() {
    this.service.getEmployees();
  }

  onClear(){
    this.service.form.reset();
    this .service.initializeFormGroup();
  }

  onSubmit(){
    if(this.service.form.valid){
      if(this.service.form.get('$key').value)
        this.service.insertEmployee(this.service.form.value);
      else
        this.service.updateEmployee(this.service.form.value);
      
      this.service.form.reset();
      this .service.initializeFormGroup();
      this.notificationservice.success('::Submitted Successfully');
      this.onClose();
    }
  }

  onClose(){
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dailogref.close();
  }

}
