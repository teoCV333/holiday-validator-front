import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of } from 'rxjs';
import { Holiday } from 'src/app/interfaces/holiday';
import { HolidayValidatorService } from 'src/app/services/holiday-validator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  years: number[] = [];
  holidays: Holiday[] = [];
  displayedColumns: string[] = ['nombre', 'dia', 'mes'];

  dataSource = new MatTableDataSource<Holiday>(this.holidays);

  constructor(private holidayValidatorService: HolidayValidatorService, private snackBar: MatSnackBar) {}


  ngOnInit() {
    this.initializeYears();
    this.getHolidays(new Date().getFullYear());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  }

  validateDate(dateValue: string): void {
    const [year, month, day] = dateValue.split('-').map(Number);
    if(!dateValue) {
      return this.showSnackBar('Selecciona una fecha');
    } else {
      try {
        this.holidayValidatorService.validateDate(year, month, day).subscribe((res) => {
          this.showSnackBar(res);
        });
      } catch (error) {
        
      }
    }
  }

  private getHolidays(year: number) {
    const res = this.holidayValidatorService.getHolidays(year).subscribe((res) => {
      this.holidays = res;
      this.dataSource.data = res;
    });
  }


  validateYear(yearSelect: HTMLSelectElement) {
    const year = +yearSelect.value;
    this.getHolidays(year);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: 'custom-snackbar'
    });
  }


  //para evitar que el usuario digite manualmente la fecha en el input
  disableKeyboardInput(event: KeyboardEvent): void {
    event.preventDefault();
}

}
