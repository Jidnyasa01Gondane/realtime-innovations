import { Component, inject } from '@angular/core';
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonListHeader,
  IonItemSliding,
} from '@ionic/angular/standalone';
import { EmployeeDetailComponent } from '../employee/employee-details.component';

import { DataService, Employee } from '../services/data.service';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ViewWillLeave, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    EmployeeDetailComponent,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink,
    IonListHeader,
    IonItemSliding,
  ],
})
export class HomePage implements ViewWillLeave, ViewWillEnter {
  private data = inject(DataService);
  currentEmployeeList: Employee[] = [];
  previousEmployeeList: Employee[] = [];
  employeeList: Employee[] = [];

  private destroyed = new Subject();
  refreshSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    addIcons({ addOutline });
  }

  ionViewWillLeave(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
    this.refreshSubject.complete();
  }

  ionViewWillEnter(): void {
    this.refreshSubject.asObservable()
      .pipe(
        tap(() => {
          this.currentEmployeeList = [];
          this.previousEmployeeList = [];
        }),
        switchMap(() => this.data.getMessages()),
        takeUntil(this.destroyed)
      )
      .subscribe((data) => {
        this.employeeList = data;
        data.forEach((emp) => {
          if (!this.data.isPastDate(emp.endDate)) {
            this.currentEmployeeList.push(emp);
          } else {
            this.previousEmployeeList.push(emp);
          }
        });
      });
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
    this.refreshSubject.next(true);
  }

  reloadList(event: boolean) {
    this.refreshSubject.next(event);
  }
}
