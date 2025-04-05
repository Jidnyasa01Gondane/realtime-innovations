import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {
  CalenderModelComponent,
} from '../calender-model/calender-model.component';
import moment from 'moment';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonItem, IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-calender-input',
  templateUrl: './calender-input.component.html',
  styleUrls: ['./calender-input.component.scss'],
  imports: [FormsModule, IonItem, IonInput, IonIcon],
  providers: [
    ModalController,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalenderInputComponent),
      multi: true,
    },
  ],
})
export class CalenderInputComponent implements ViewWillEnter, ControlValueAccessor {
  @Output() public dateEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() public inputDateTime!: string;
  @Input() public placeholder: string = '';
  @Input() public id!: string;
  @Input() public min?: string;
  @Input() public max?: string;
  @Input() public dateFormat?: string;
  @Input() buttonConfig: string[] = [];

  public formattedDateTime!: string;

  public dateTime: any = {
    date: '',
    time: '',
  };
  private onChange: ((value: string) => void) | undefined;
  private onTouched: (() => void) | undefined;

  public constructor(private modalController: ModalController) {
    addIcons({ calendarOutline });
  }

  writeValue(value: any): void {
    this.formattedDateTime = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public ionViewWillEnter() {
    this.formatDateTime();
  }

  public async onClick() {
    if(this.onTouched){
      this.onTouched()
    }
    const existingModal = await this.modalController.getTop();
    if(existingModal) {
      return;
    }
    const modal = await this.modalController.create({
      component: CalenderModelComponent,
      componentProps: {
        inputDateTime: this.inputDateTime,
        min: this.min,
        max: this.max,
        dateFormat: this.dateFormat ?? 'L',
        buttons: this.buttonConfig,
      },
      cssClass: 'custom-datetime-picker',
      id: 'calender-modal',
      backdropDismiss: false
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
        if(this.onChange) {
          this.onChange(result.data ?? this.inputDateTime);
        }
      }
    });
  }

  private formatDateTime() {
    this.formattedDateTime = moment(this.inputDateTime).format(
      this.dateFormat ?? 'L'
    );
  }
}
