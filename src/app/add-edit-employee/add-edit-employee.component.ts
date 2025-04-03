import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  briefcaseOutline,
  calendarOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { CalenderInputComponent } from '../calender-input/calender-input.component';

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
    IonModal,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    CalenderInputComponent
  ],
})
export class AddEditEmployeeComponent implements OnInit {

  isModalOpen = false;
dateTime1!: string;
  constructor() {
    addIcons({
      personOutline,
      briefcaseOutline,
      calendarOutline,
      arrowForwardOutline,
    });
  }

  ngOnInit() {}

  closeModal() {
    this.isModalOpen = false;
  }

  public date1Changed(value: any) {
    this.dateTime1 = value;
    console.log(this.dateTime1);
  }
}
