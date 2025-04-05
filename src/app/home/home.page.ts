import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, ViewChildren, WritableSignal } from '@angular/core';
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
  IonFooter,
} from '@ionic/angular/standalone';
import { EmployeeDetailComponent } from '../employee/employee-details.component';

import { DataService, Employee } from '../shared/services/data.service';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { ViewWillEnter, Platform } from '@ionic/angular';

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
    IonFooter,
  ],
})
export class HomePage implements ViewWillEnter, OnInit, OnDestroy {
  @ViewChildren('slidingItem') slidingItem!: IonItemSliding[];

  employeeList: WritableSignal<Employee[]> = signal([]);
  isLargerScreen = false;

  currentEmployeeList: Signal<Employee[]> = computed(() => this.employeeList().filter(emp => !this.data.isPastDate(emp.endDate)));
  previousEmployeeList: Signal<Employee[]> = computed(() => this.employeeList().filter(emp => this.data.isPastDate(emp.endDate)));

  private destroyed = new Subject();
  private refreshSubject = new BehaviorSubject<boolean>(false);
  private platform = inject(Platform);
  private data = inject(DataService);

  constructor() {
    addIcons({ addOutline });
    this.checkDeviceSize();
  }

  
  ngOnInit(): void {
    window.addEventListener('resize', () => this.checkDeviceSize());
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
    this.refreshSubject.complete();
  }

  ionViewWillEnter(): void {
    this.refreshSubject
      .asObservable()
      .pipe(
        switchMap(() => this.data.getMessages()),
        takeUntil(this.destroyed)
      )
      .subscribe(data => {
        this.employeeList.update(() => [...data]);
      });
  }

  refresh(ev: RefresherCustomEvent): void {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
    this.refreshSubject.next(true);
  }

  reloadList(event: boolean): void {
    this.refreshSubject.next(event);
  }

  private checkDeviceSize(): void {
    this.isLargerScreen = this.platform.width() > 768;
    if (this.isLargerScreen && this.slidingItem) {
      this.slidingItem.forEach(async s => {
        const isOpen = await s.getOpenAmount();
        if (isOpen) {
          s.close();
        }
      });
    }
  }
}
