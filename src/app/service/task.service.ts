import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { ViewTask } from '../model/viewtask';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private serviceURL = 'http://localhost:8082/projectmanager'

  constructor(private http: HttpClient){}

  getViewTask(): Observable<ViewTask[]> {
      return this.http.get<ViewTask[]>(`${this.serviceURL}/alltask`).pipe(
          tap(data => console.log('All : ' + JSON.stringify(data))),
          catchError(this.handleError)
      );
  }

  addTask(task: ViewTask): Observable<ViewTask> {

    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.post<ViewTask>(`${this.serviceURL}/addtask`, task).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }

  updateTask(task: any): Observable<ViewTask> {

    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.post<ViewTask>(`${this.serviceURL}/updatetask`, task, httpOptions).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }
  
  private handleError(err: HttpErrorResponse) {
      let errorMessage = '';
      if (err.error instanceof ErrorEvent) {
          errorMessage = `An error occured: ${err.error.message}`;
      } else {
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
      }
      console.error(errorMessage);
      return throwError(errorMessage);
  }

}
