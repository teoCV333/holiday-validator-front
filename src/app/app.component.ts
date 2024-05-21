import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private apiUrl = 'http://127.0.0.1:8080/festivos';

  years: number[] = [];
  holidays: Holiday[] = [];
  displayedColumns: string[] = ['nombre', 'dia', 'mes'];

  dataSource = new MatTableDataSource<Holiday>(this.holidays);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initializeYears();
    this.getHolidays(new Date().getFullYear());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  title = 'holiday_validator_front';

  private initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  }

  validateDate(dateValue: string): void {
    if (!dateValue) {
      this.showSnackBar('Selecciona una fecha');
      return;
    }

    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;

    try {
      this.http.get(`${this.apiUrl}/verificar/${year}/${month}/${day}`, { responseType: 'text' })
      .pipe(catchError(error => {
        return of('Error en la verificación de la fecha');
      }))
      .subscribe(res => {
        if(res === 'Error en la verificación de la fecha') {
          return this.showSnackBar(res);
        };
        const message = res === 'no es festivo!!' ? 'No es festivo!!' : 'Si es festivo!!';
        this.showSnackBar(message);
    });
    } catch (error) {
      return this.showSnackBar("Error del servidor");
    }
  }

  validateYear(yearSelect: HTMLSelectElement) {
    const year = +yearSelect.value;
    this.getHolidays(year);
  }

  private getHolidays(year: number) {
    this.http.get<Holiday[]>(`${this.apiUrl}/${year}`)
      .pipe(catchError(error => {
        console.error('Error:', error);
        this.holidays = [];
        this.dataSource.data = this.holidays;
        return of([]);
      }))
      .subscribe((res) => {
        this.holidays = res;
        this.dataSource.data = this.holidays;
      });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: 'custom-snackbar'
    });
  }
}

export interface Holiday {
  nombre: string;
  dia: number;
  mes: number;
}