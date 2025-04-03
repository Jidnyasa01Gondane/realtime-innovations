import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

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
    MessageComponent,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private data = inject(DataService);
  employeeList: any = [];
  constructor() {
    addIcons({ addOutline });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.data
      .getMessages()
      .pipe()
      .subscribe((data) => {
        this.employeeList = data;
      });
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
}
