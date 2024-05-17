import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private apiUrl = 'http://127.0.0.1:8080/festivos';

  years: number[] = [];
  holidays: any[] = [];
  displayedColumns: string[] = ['nombre', 'dia', 'mes'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
      // Obtener el año actual
      const currentYear = new Date().getFullYear();
      // Generar las opciones de años
      for (let i = currentYear; i > currentYear - 50; i--) {
        this.years.push(i);
      }
  }

  title = 'holiday_validator_front';

  validateDate(dateValue: string): void {
    if(dateValue) {
      const date = new Date(dateValue);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
      const day = date.getDate() + 1;

      this.http.get(`${this.apiUrl}/verificar/${year}/${month}/${day}`, { responseType: 'text' }).subscribe(res=> {
        if(res == 'no es festivo!!') {
          this.snackBar.open('No es festivo!!', '', {
            duration: 3000,
            panelClass: 'custom-snackbar'
          });
        } else {
          this.snackBar.open('Si es festivo!!', '', {
            duration: 3000,
            panelClass: 'custom-snackbar'
          });
        }
      },
      error => {
        console.error('Error:', error);
      });  
    } else {
      this.snackBar.open('Selecciona una fecha','', {
        duration: 3000,
        panelClass: 'custom-snackbar'
      });
    }
    }

  validateYear(yearSelect: HTMLSelectElement) {
    const year = +yearSelect.value;
    this.http.get<any>(`${this.apiUrl}/${year}`).subscribe((res) => {
      this.holidays = res;
    });
  }

}
