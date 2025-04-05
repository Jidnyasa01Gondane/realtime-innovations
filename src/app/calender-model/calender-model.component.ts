import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ViewWillLeave } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {
  IonIcon,
  IonGrid,
  IonCol,
  IonButton,
  IonRow,
  IonFooter,
} from '@ionic/angular/standalone';
import moment from 'moment';
import { ModalController } from '@ionic/angular';
import { WeekInterface } from './week.interface';
import {
  calendarOutline,
  caretBackOutline,
  caretForwardOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { WEEKDAYS } from '../shared/calender.constant';
import { ButtonText } from './weekday.enum';

interface DayC extends moment.Moment {
  disabled?: boolean;
}

interface MonthC {
  monthName: string;
  monthNumber: number;
}

export type DateOption =
  | 'today'
  | 'nextMonday'
  | 'nextTuesday'
  | 'afterOneWeek'
  | 'noDate';

@Component({
  selector: 'app-calender-model',
  templateUrl: './calender-model.component.html',
  styleUrls: ['./calender-model.component.scss'],
  imports: [
    IonGrid,
    IonCol,
    IonIcon,
    IonButton,
    IonRow,
    IonFooter,
    IonButton,
    FormsModule,
    CommonModule,
  ],
  providers: [ModalController],
})
export class CalenderModelComponent implements OnInit {
  @Input() public inputDateTime!: string;
  @Input() public min!: moment.MomentInput;
  @Input() public max!: moment.MomentInput;
  @Input() public dateFormat!: string;
  @Input() public buttons!: DateOption[];

  public date!: moment.Moment;
  public selectedDate!: any;
  public selectedButton!: any;
  public calendar: { days: DayC[] }[] = [];
  public months: MonthC[][] = [];
  public years: number[][] = [];
  public selectedYears: number[][] = [];
  public firstYear!: number;
  public lastYear!: number;
  public nextYearDisabled = false;
  public prevYearDisabled = false;
  public weekdays: WeekInterface[] = [...WEEKDAYS];
  public mode = {
    dayPicker: true,
    monthPicker: false,
    yearPicker: false,
  };
  public buttonText = ButtonText;

  constructor(private modalController: ModalController) {
    addIcons({
      caretBackOutline,
      caretForwardOutline,
      calendarOutline,
    });
  }

  ngOnInit() {
    this.initializeDates();
    this.generateCalendar();
    this.months = this.generateMonths();
    this.years = this.generateYears();
    this.selectedYears = this.getSelectedYears(this.date.year());
    this.getFirstLastYear();
  }

  private initializeDates(): void {
    if (this.buttons.length && !this.inputDateTime) {
      this.setDate(this.buttons[0]);
    }
    this.min = this.min ? moment(this.min) : undefined;
    this.max = this.max ? moment(this.max) : undefined;
    this.date = this.inputDateTime ? moment(this.inputDateTime) : moment();
    this.selectedDate = this.date.clone();
  }

  setDate(option: DateOption): void {
    const today = new Date();
    this.selectedButton = option;
    const options = {
      today: () => today.toISOString(),
      nextMonday: () => this.getNextDayOfWeek(today, 1).toISOString(),
      nextTuesday: () => this.getNextDayOfWeek(today, 2).toISOString(),
      afterOneWeek: () => {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek.toISOString();
      },
      noDate: () => undefined,
    };
    const calculatedDate = options[option]();
    this.selectedDate = calculatedDate ? moment(calculatedDate) : undefined;
  }

  getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
    return resultDate;
  }

  public isSelectedDate(day: DayC): boolean {
    if(!this.selectDate){
      return false;
    }

    return (
      this.selectedDate.date() === day.date() &&
      this.selectedDate.month() === day.month() &&
      !day.disabled
    );
  }

  public async cancelModal() {
    await this.modalController.dismiss();
  }

  public async dismissModal() {
    const dateTime = moment(`${this.selectedDate.format('YYYY-MM-DD')}`);

    await this.modalController.dismiss({
      dateTime,
    });
  }

  public selectDate(date: DayC): void {
    if (!date?.disabled) {
      this.selectedDate = date;
    }
  }

  public selectPreviousMonth(): void {
    this.date.subtract(1, 'month');
    this.generateCalendar();
  }

  public selectNextMonth(): void {
    this.date.add(1, 'month');
    this.generateCalendar();
  }

  public selectPreviousYears() {
    const findInMatrix = this.findArrayInMatrix(this.years);
    if (findInMatrix > -1) {
      const newIndex = findInMatrix - 1;
      this.selectedYears = this.setSelectedYears(newIndex);
      this.getFirstLastYear();
    }
    this.disableNextPrevYears();
  }

  public selectNextYears() {
    const findInMatrix = this.findArrayInMatrix(this.years);
    if (findInMatrix > -1 && findInMatrix < this.years.length - 1) {
      const newIndex = findInMatrix + 1;
      this.selectedYears = this.setSelectedYears(newIndex);
      this.getFirstLastYear();
    }
    this.disableNextPrevYears();
  }

  public selectMode(key: keyof typeof this.mode): void {
    Object.keys(this.mode).forEach(
      (k) => (this.mode[k as keyof typeof this.mode] = k === key)
    );
  }

  public selectMonth(monthNumber: number): void {
    this.date.month(monthNumber);
    this.generateCalendar();
    this.selectMode('dayPicker');
  }

  public selectYear(year: number): void {
    this.date.year(year);
    this.selectMode('monthPicker');
  }

  private generateMonths(): MonthC[][] {
    return Array.from({ length: 12 }, (_, i) => ({
      monthName: moment.monthsShort()[i],
      monthNumber: i,
    })).reduce(
      (acc, month, i) => {
        acc[Math.floor(i / 3)].push(month);
        return acc;
      },
      [[], [], [], []] as MonthC[][]
    );
  }

  private generateYears(): number[][] {
    const startYear = 1970;
    const endYear = 2099;
    const yearsToSort = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
    return Array.from({ length: Math.ceil(yearsToSort.length / 16) }, (_, i) =>
      yearsToSort.slice(i * 16, (i + 1) * 16)
    );
  }

  private findArrayInMatrix(matrix: any[][]): number {
    const array = this.selectedYears.flat();
    let index = -1;

    matrix.some((item, i) => {
      if (JSON.stringify(item) === JSON.stringify(array)) {
        index = i;
        return true;
      } else {
        return false;
      }
    });

    return index;
  }

  private getSelectedYears(year: number): number[][] {
    const subArray = this.years.find((subArray) => subArray.includes(year));
    return this.formatSelectedYears(subArray || this.years[0]);
  }

  private formatSelectedYears(selectedYears: number[]): number[][] {
    return Array.from({ length: Math.ceil(selectedYears.length / 4) }, (_, i) =>
      selectedYears.slice(i * 4, (i + 1) * 4)
    );
  }

  private getFirstLastYear(): void {
    this.firstYear = this.selectedYears[0][0];
    const lastSubArray = this.selectedYears[this.selectedYears.length - 1];
    this.lastYear = lastSubArray[lastSubArray.length - 1];
  }

  private setSelectedYears(index: number): number[][] {
    const selectedArr = this.years[index];
    return selectedArr ? this.formatSelectedYears(selectedArr) : [];
  }

  public disableNextPrevYears(): void {
    this.nextYearDisabled = false;
    this.prevYearDisabled = false;

    const lastSelectedYear =
      this.selectedYears[this.selectedYears.length - 1].slice(-1)[0];
    const lastYear = this.years[this.years.length - 1].slice(-1)[0];
    if (lastYear === lastSelectedYear) {
      this.nextYearDisabled = true;
    }

    const firstSelectedYear = this.selectedYears[0][0];
    const firstYear = this.years[0][0];
    if (firstYear === firstSelectedYear) {
      this.prevYearDisabled = true;
    }
  }

  private disableDaysOnDateRange(
    min: moment.MomentInput,
    max: moment.MomentInput
  ): void {
    for (const week of this.calendar) {
      for (const day of week.days) {
        if (min && day < min) {
          day.disabled = true;
        }

        if (max && day > max) {
          day.disabled = true;
        }
      }
    }
  }

  private generateCalendar(): void {
    this.calendar = [];
    const startDay = this.date.clone().startOf('month').startOf('week');
    const endDay = this.date.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');

    while (date.isBefore(endDay, 'day')) {
      this.calendar.push({
        days: Array.from({ length: 7 }, () => date.add(1, 'day').clone()),
      });
    }

    this.disableDaysOnDateRange(this.min, this.max);
  }
}
