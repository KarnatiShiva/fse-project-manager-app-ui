import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { User } from '../model/user';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serviceURL = 'http://localhost:8082/projectmanager'

  constructor(private http: HttpClient){}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.serviceURL}/allusers`).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );
  }

  addUser(user: User): Observable<User> {

    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.post<User>(`${this.serviceURL}/adduser`, user).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }

  updateUser(user: any): Observable<User> {

    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.post<User>(`${this.serviceURL}/updateuser`, user, httpOptions).pipe(
        tap(data => console.log('All : ' + JSON.stringify(data))),
        catchError(this.handleError)
    );  
  }

  deleteUser(userId: any): Observable<any> {
    httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    httpOptions.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    httpOptions.headers.append('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    httpOptions.headers.append('Access-Control-Allow-Credentials', 'true');

    return this.http.delete(`${this.serviceURL}/deleteuser/${userId}`, httpOptions).pipe(
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
