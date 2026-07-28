import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';

import { HttpResponseInterface } from '@utils/interfaces';

import {
  InstitutionInterface,
  InstitutionState
} from './institution.state';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = `${environment.API_URL}/institution`;

  createInstitution(payload: InstitutionState): Observable<InstitutionInterface> {
    const url = this.apiUrl;

    return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
      map((response) => response.data)
    );
  }

  updateInstitution(
    id: string,
    payload: InstitutionState
  ): Observable<InstitutionInterface> {
    const url = `${this.apiUrl}/${id}`;

    return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
      map((response) => response.data)
    );
  }

  deleteInstitution(id: string): Observable<InstitutionInterface> {
    const url = `${this.apiUrl}/${id}`;

    return this.httpClient.delete<HttpResponseInterface>(url).pipe(
      map((response) => response.data)
    );
  }

  findInstitution(page = 1, search = ''): Observable<HttpResponseInterface> {
    const url = this.apiUrl;

    let params = new HttpParams()
      .append('page', page);

    if (search) {
      params = params.append('search', search);
    }

    return this.httpClient.get<HttpResponseInterface>(url, { params }).pipe(
      map((response) => response)
    );
  }

  findOneInstitution(id: string): Observable<InstitutionInterface> {
    const url = `${this.apiUrl}/${id}`;

    return this.httpClient.get<HttpResponseInterface>(url).pipe(
      map((response) => response.data)
    );
  }
}