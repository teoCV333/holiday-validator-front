import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, of } from 'rxjs';
import { Holiday } from '../interfaces/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidayValidatorService {

  private apiUrl = 'http://127.0.0.1:8080/festivos';

  holidays: Holiday[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  validateDate(year: number, month: number, day: number):Observable<string> {
      return this.http.get(`${this.apiUrl}/verificar/${year}/${month}/${day}`, { responseType: 'text' })
      .pipe(catchError(error => {
        return of("Error en la verificación de la fecha");
      }));
  }

  getHolidays(year: number) : Observable<Holiday[]>{
    return this.http.get<Holiday[]>(`${this.apiUrl}/${year}`)
      .pipe(catchError(error => {
        console.error('Error:', error);
        return of([]);
      }));
  }

}
