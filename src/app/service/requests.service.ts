import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private apiUrl = "http://127.0.0.1:8000/api/";
  constructor(private httpClient: HttpClient) { }

  public Get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(this.apiUrl + url);
  }

  public Post<T>(url: string, Data: any, option?: any): Observable<T> {
    return this.httpClient.post<T>(this.apiUrl + url, Data);
  }

  public Delete<T>(url: string, option?: any): Observable<T> {
    return this.httpClient.delete<T>(this.apiUrl + url);
  }

  loggedIn(){
    return !!localStorage.getItem("token");
  }
}
