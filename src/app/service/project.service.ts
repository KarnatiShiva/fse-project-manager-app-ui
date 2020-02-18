import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Project } from '../model/project';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private serviceURL = 'http://localhost:8082/projectmanager'

  constructor(private http: HttpClient){}

  getProjects(): Observable<Project[]> {

      return this.http.get<Project[]>(`${this.serviceURL}/allproject`, httpOptions).pipe(
          tap(data => console.log('All : ' + JSON.stringify(data))),
          catchError(this.handleError)
      );
  }

  addProject(project: Project): Observable<Project> {    

    return this.http.post<Project>(`${this.serviceURL}/addproject`, project).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }

  updateProject(project: any): Observable<Project> {   

    return this.http.post<Project>(`${this.serviceURL}/updateproject`, project, httpOptions).pipe(
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
