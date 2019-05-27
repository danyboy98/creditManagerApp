import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Transfer } from '../shared/transfers';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(baseURL + 'allusers')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getUser(id: String): Observable<User> {
    return this.http.get<User>(baseURL + 'allusers/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  };

  transaction(transaction: Transfer): Observable<Transfer> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(transaction);
    return this.http.put<Transfer>(baseURL + 'allusers/' + transaction.userId, transaction, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
