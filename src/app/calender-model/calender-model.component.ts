import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { MomentInput } from 'moment';
import { ModalController } from '@ionic/angular';
import { WeekInterface } from './week.interface';
import { caretBackOutline, caretForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { WEEKDAYS } from '../shared/calender.constant';

interface DayC extends moment.Moment {
  disabled?: boolean;
}

interface MonthC {
  monthName: string;
  monthNumber: number;
}

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

  public date!: moment.Moment;
  public selectedDate!: any;
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

  constructor(private modalController: ModalController) {
    addIcons({
      caretBackOutline,
      caretForwardOutline,
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
    this.setDate('today');
    this.min = this.min ? moment(this.min) : undefined;
    this.max = this.max ? moment(this.max) : undefined;
    this.date = this.inputDateTime ? moment(this.inputDateTime) : moment();
    this.selectedDate = this.date.clone();
  }

  setDate(option: string): void {
    const today = new Date();
    const options = {
      today: () => today.toISOString(),
      nextMonday: () => this.getNextDayOfWeek(today, 1).toISOString(),
      nextTuesday: () => this.getNextDayOfWeek(today, 2).toISOString(),
      afterOneWeek: () => {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        return nextWeek.toISOString();
      },
    };
    this.selectedDate = options[option as keyof typeof options];
  }

  getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
    return resultDate;
  }

  public isSelectedDate(day: DayC): boolean {
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

  public selectPreviousYears(): void {
    this.updateSelectedYears(-1);
  }

  public selectNextYears(): void {
    this.updateSelectedYears(1);
  }

  private updateSelectedYears(offset: number): void {
    const findInMatrix = this.findArrayInMatrix(this.years);
    if (
      findInMatrix > -1 &&
      findInMatrix + offset >= 0 &&
      findInMatrix + offset < this.years.length
    ) {
      this.selectedYears = this.setSelectedYears(findInMatrix + offset);
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
    return matrix.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(array)
    );
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
    this.nextYearDisabled = this.isYearDisabled(
      this.selectedYears[this.selectedYears.length - 1]
    );
    this.prevYearDisabled = this.isYearDisabled(this.selectedYears[0]);
  }

  private isYearDisabled(yearArray: number[]): boolean {
    const year = yearArray[yearArray.length - 1];
    return this.years.some((subArray) => subArray.includes(year));
  }

  private disableDaysOnDateRange(
    min: moment.MomentInput,
    max: moment.MomentInput
  ): void {
    for (const week of this.calendar) {
      for (const day of week.days) {
        if ((min && day < min) || (max && day > max)) {
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
