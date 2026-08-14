import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {SchoolPeriodInterface, SchoolPeriodState} from "./school-period.state";

@Injectable({providedIn: 'root'})
export class SchoolPeriodService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/career-coordinator/school-periods`;

    createSchoolPeriod(payload: SchoolPeriodState) {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    updateSchoolPeriod(id: string, payload: SchoolPeriodState) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    deleteSchoolPeriod(id: string) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    openSchoolPeriod(id: string) {
        const url = `${this.apiUrl}/${id}/open`;

        return this.httpClient.patch<HttpResponseInterface>(url, {}).pipe(
            map((response) => response.data)
        );
    }

    closeSchoolPeriod(id: string) {
        const url = `${this.apiUrl}/${id}/close`;

        return this.httpClient.patch<HttpResponseInterface>(url, {}).pipe(
            map((response) => response.data)
        );
    }

    findOpenSchoolPeriod(): Observable<SchoolPeriodInterface> {
        const url = `${this.apiUrl}/open`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    findSchoolPeriods(page: number, search: string): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        let params = new HttpParams()
            .append('page', page)
            .append('limit', 10)
            .append('sort', 'startedAt')
            .append('order', 'DESC');

        if (search) {
            params = params.append('search', search);
        }

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => response)
        );
    }

    findSchoolPeriod(id: string): Observable<SchoolPeriodState> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }
}
