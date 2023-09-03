import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [
    `
      select {
        font-size: 1.2em;
        padding: 0.5em;
        margin: 0.5em;
      }
    `,
  ],
  template: `
    <h1>Angular Date Picker</h1>

    <p>Min date: {{ minDate | date : 'yyyy MM dd' }}</p>
    <p>Max date: {{ maxDate | date : 'yyyy MM dd' }}</p>
    <p>
      Selected date : {{ selectedYear }}-{{ selectedMonth }}-{{ selectedDay }}
    </p>

    <select [(ngModel)]="selectedDay">
      <option *ngFor="let day of days" [value]="day">{{ day }}</option>
    </select>

    <select [(ngModel)]="selectedMonth" (ngModelChange)="updateDays()">
      <option *ngFor="let month of months" [value]="month">{{ month }}</option>
    </select>
    <select [(ngModel)]="selectedYear" (ngModelChange)="updateMonths()">
      <option *ngFor="let year of years" [value]="year">{{ year }}</option>
    </select>
  `,
})
export class AppComponent implements OnInit {
  minDate: Date = new Date(2024, 2 - 1, 6);
  maxDate: Date = new Date(2025, 11 - 1, 15);

  selectedYear!: number;
  selectedMonth!: number;
  selectedDay!: number;

  years: number[] = [];
  months: number[] = [];
  days: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.populateYears();
    this.selectedYear = this.minDate.getFullYear();
    this.updateMonths();
  }

  populateYears() {
    for (
      let year = this.minDate.getFullYear();
      year <= this.maxDate.getFullYear();
      year++
    ) {
      this.years.push(year);
    }
  }

  updateMonths() {
    const startMonth =
      this.selectedYear == this.minDate.getFullYear()
        ? this.minDate.getMonth() + 1
        : 1;
    const endMonth =
      this.selectedYear == this.maxDate.getFullYear()
        ? this.maxDate.getMonth() + 1
        : 12;

    this.months = [];
    for (let month = startMonth; month <= endMonth; month++) {
      this.months.push(month);
    }

    if (this.selectedMonth == null) this.selectedMonth = this.months[0];
    if (this.selectedMonth < startMonth) {
      this.selectedMonth = startMonth;
    } else if (this.selectedMonth > endMonth) {
      this.selectedMonth = endMonth;
    }

    this.updateDays();
  }

  isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  getDaysInMonth(year: number, month: string): number {
    switch (month) {
      case '1': // January
      case '3': // March
      case '5': // May
      case '7': // July
      case '8': // August
      case '10': // October
      case '12': // December
        return 31;
      case '4': // April
      case '6': // June
      case '9': // September
      case '11': // November
        return 30;
      case '2': // February
        return this.isLeapYear(year) ? 29 : 28;
      default:
        throw new Error(`Invalid month: ${month}`);
    }
  }

  updateDays() {
    this.days = [];

    const startDay =
      this.selectedYear == this.minDate.getFullYear() &&
      this.selectedMonth == this.minDate.getMonth() + 1
        ? this.minDate.getDate()
        : 1;

    const daysInMonth =
      this.selectedYear == this.maxDate.getFullYear() &&
      this.selectedMonth == this.maxDate.getMonth() + 1
        ? this.maxDate.getDate()
        : this.getDaysInMonth(
            this.selectedYear,
            this.selectedMonth!.toString()
          );

    for (let day = startDay; day <= daysInMonth; day++) {
      this.days.push(day);
    }

    if (this.selectedDay == null) {
      this.selectedDay = this.days[0];
    } else {
      if (this.selectedDay > daysInMonth) {
        this.selectedDay = daysInMonth;
      } else if (this.selectedDay < startDay) {
        this.selectedDay = startDay;
      }
    }
  }
}
