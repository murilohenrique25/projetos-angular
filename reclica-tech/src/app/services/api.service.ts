import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PurchaseItem } from '../models/purchase-item.model';
import { Unit } from '../models/unit.model';
import { Expense } from '../models/expense.model';
import { DashboardData } from '../models/dashboard-data.model';
import { CompanyData } from '../models/company-data.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://sua-api.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.baseUrl}/login`, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getMaterials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recyclable-materials`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.baseUrl}/units`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  savePurchase(purchase: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recycling-purchases`, purchase, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveUnit(unit: Unit): Observable<any> {
    return this.http.post(`${this.baseUrl}/units`, unit, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  saveExpense(expense: Expense): Observable<any> {
    return this.http.post(`${this.baseUrl}/expenses`, expense, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCompanyData(): Observable<CompanyData> {
    return this.http.get<CompanyData>(`${this.baseUrl}/company`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Erro de conexão'));
  }
}