import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Headers for API calls
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      //  auth tokens here when ready
      // 'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  // Business Types
  getBusinessTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-types`, { headers: this.getHeaders() });
  }

  // Business Categories
  getBusinessCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/business-categories`, { headers: this.getHeaders() });
  }

  // Countries
  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/countries`, { headers: this.getHeaders() });
  }

  // Submit Merchant Application
  submitMerchantApplication(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/merchant/onboard`, data, { headers: this.getHeaders() });
  }

  // Upload Documents
  uploadDocument(file: File, documentType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return this.http.post<any>(`${this.baseUrl}/documents/upload`, formData);
  }

  // Get Application Status
  getApplicationStatus(merchantId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/merchant/status/${merchantId}`, { headers: this.getHeaders() });
  }
}
