import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalenderModelComponent } from '../calender-model/calender-model.component';
import { WeekdayEnum } from '../calender-model/weekday.enum';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import {
  IonItem,
  IonInput, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-calender-input',
  templateUrl: './calender-input.component.html',
  styleUrls: ['./calender-input.component.scss'],
  imports: [FormsModule, IonItem,
    IonInput, IonIcon],
  providers: [ModalController]
})
export class CalenderInputComponent implements OnInit {
  @Output() public dateEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public inputDateTime!: string;
  @Input() public placeholder!: string;
  @Input() public id!: string;
  @Input() public min?: string;
  @Input() public max?: string;
  @Input() public dateFormat?: string;

  public formattedDateTime!: string;

  public dateTime: any = {
    date: '',
    time: '',
  };

  public constructor(private modalController: ModalController) {
    addIcons({calendarOutline})
  }

  public ngOnInit() {
    this.formatDateTime();
  }

  public async onClick() {
    const modal = await this.modalController.create({
      component: CalenderModelComponent,
      componentProps: {
        inputDateTime: this.inputDateTime,
        min: this.min,
        max: this.max,
        dateFormat: this.dateFormat ?? 'L',
      },
      cssClass: 'custom-datetime-picker',
      id: 'calender-modal'
    });
    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        if (result.data.length === 0 || Object.keys(result.data).length === 0) {
          result.data = undefined;
        }
        if (result.data) {
          if (result.data.dateTime) {
            this.inputDateTime = moment(result.data.dateTime).format(
              'YYYY-MM-DD'
            );
          }
          this.formatDateTime();
          this.dateEvent.emit(this.inputDateTime);
        }
      }
    });
  }

  private formatDateTime() {
    this.formattedDateTime = moment(this.inputDateTime).format(this.dateFormat ?? 'L');
  }
}
