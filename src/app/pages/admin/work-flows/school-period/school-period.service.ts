import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {SchoolPeriodState} from "./school-period.state";
import {SchoolPeriodInterface} from "./school-period.state";

@Injectable({providedIn: 'root'})
export class SchoolPeriodService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/school-period`;

    createSchoolPeriod(payload: SchoolPeriodState) {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    updateSchoolPeriod(id: string, payload: SchoolPeriodState) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    deleteSchoolPeriod(id: string) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findSchoolPeriod(page: number, search: string): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        let params = new HttpParams()
            .append('page', page);

        if (search) {
            params = params.append('search', search);
        }

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOneSchoolPeriod(id: string): Observable<SchoolPeriodInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
