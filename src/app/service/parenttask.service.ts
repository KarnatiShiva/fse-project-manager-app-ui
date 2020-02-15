import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { ParentTask } from '../model/parenttask';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

@Injectable({
  providedIn: 'root'
})
export class ParentTaskService {

  private serviceURL = 'http://localhost:8082/projectmanager'

  constructor(private http: HttpClient){}
  
  addParentTask(parentTask: ParentTask): Observable<ParentTask> {

    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.post<ParentTask>(`${this.serviceURL}/addparenttask`, parentTask).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }

  getParentTasks(): Observable<ParentTask[]> {
    return this.http.get<ParentTask[]>(`${this.serviceURL}/allparenttask`).pipe(
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
