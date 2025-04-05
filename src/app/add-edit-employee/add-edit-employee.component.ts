import { Component, Input } from '@angular/core';
import { ViewWillLeave, ViewWillEnter } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonButtons,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, briefcaseOutline, calendarOutline, arrowForwardOutline, trashOutline } from 'ionicons/icons';
import { CalenderInputComponent } from '../calender-input/calender-input.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, Employee } from '../services/data.service';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import moment from 'moment';
import { ToasterService } from '../shared/toaster.service';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    CalenderInputComponent,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    IonText,
    IonButtons,
  ],
  providers: [DataService],
})
export class AddEditEmployeeComponent implements ViewWillLeave, ViewWillEnter {
  startBtnConfig = ['today', 'nextMonday', 'nextTuesday', 'afterOneWeek'];
  endBtnConfig = ['noDate', 'today'];
  isModalOpen = false;
  dateTime1!: string;
  dateTime2!: string;
  employee: FormGroup;
  today: string;
  minDate!: string;
  employeeId!: number;
  destroyed = new Subject();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toasterService: ToasterService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      briefcaseOutline,
      calendarOutline,
      arrowForwardOutline,
      trashOutline,
    });

    this.employee = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      role: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl(''),
    });

    this.today = new Date().toISOString();
    this.minDate = this.employeeId ? this.minDate : moment(this.today).subtract(1, 'days').format('L');
  }

  @Input()
  set id(employeeID: string) {
    if (employeeID) {
      this.employeeId = Number(employeeID);
      this.dataService
        .getEmployeeById(Number(employeeID))
        .pipe(takeUntil(this.destroyed))
        .subscribe(data => {
          this.dateTime1 = data.startDate;
          this.dateTime2 = data.endDate;
          const isCurrentEmployee = !this.dataService.isPastDate(data.endDate);
          if (isCurrentEmployee && this.dataService.isPastDate(data.startDate)) {
            this.minDate = moment(this.today).subtract(1, 'days').format('L');
          } else if (!this.dataService.isPastDate(data.startDate)) {
            this.minDate = data.startDate;
          } else {
            this.minDate = data.endDate;
          }
          this.employee.patchValue(data);
        });
    }
  }

  ionViewWillEnter(): void {
    this.employee.markAsUntouched();
  }

  ionViewWillLeave(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
    this.employee.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  public date1Changed(value: string): void {
    this.dateTime1 = value;
    console.log(this.dateTime1);
  }

  public date2Changed(value: string): void {
    this.dateTime2 = value;
    console.log(this.dateTime2);
  }

  async addEditEmployee(): Promise<void> {
    console.log(this.employee.value);
    const data = this.employee.value;
    const employeeDetails: Employee = {
      name: data.name,
      role: data.role,
      startDate: data.startDate?.dateTime ? data.startDate.dateTime.format('L') : data.startDate,
      endDate: data.endDate?.dateTime ? data.endDate.dateTime.format('L') : (data.endDate ?? ''),
    };
    try {
      let employee;
      if (this.employeeId) {
        employeeDetails.id = this.employeeId;
        employee = await lastValueFrom(this.dataService.updateEmployee(employeeDetails));
      } else {
        employee = await lastValueFrom(this.dataService.addEmployee(employeeDetails));
      }

      await this.toasterService.presentToast('bottom', `Employee ${employee.name} added successfully`);
      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error) {
      await this.toasterService.presentToast('bottom', `Error adding employee`);
    }
  }

  async deleteEmployee(id: number | undefined): Promise<void> {
    if (!id) {
      return;
    }

    try {
      await lastValueFrom(this.dataService.deleteEmployeeById(id));
      this.router.navigate(['/home'], { replaceUrl: true });
      await this.toasterService.presentToast('bottom', `Employee has been deleted successfully`);
    } catch (error) {
      await this.toasterService.presentToast('bottom', `Error adding employee`);
    }
  }
}
