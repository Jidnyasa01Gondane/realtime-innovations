import { inject, Injectable } from '@angular/core';
import moment from 'moment';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

export interface Employee {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dbService = inject(NgxIndexedDBService);

  constructor() {}

  public getMessages(): Observable<Employee[]> {
    return this.dbService.getAll('employee');
  }

  addEmployee(employeeDetails: Employee): Observable<Employee> {
    return this.dbService.add('employee', employeeDetails);
  }

  updateEmployee(employeeDetails: Employee): Observable<Employee> {
    return this.dbService.update('employee', employeeDetails);
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.dbService.getByKey('employee', employeeId);
  }

  deleteEmployeeById(employeeId: number): Observable<any> {
    return this.dbService.deleteByKey('employee', employeeId);
  }

  isPastDate(date: string): boolean {
    return moment(date).isBefore(moment(), 'day');
  }
}
