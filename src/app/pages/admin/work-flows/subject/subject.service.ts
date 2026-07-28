import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {SubjectInterface, SubjectState} from "./subject.state";

@Injectable({providedIn: 'root'})
export class SubjectService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/subject`;

    createSubject(payload: SubjectState) {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    updateSubject(id: string, payload: SubjectState) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    deleteSubject(id: string) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findSubject(page: number, search: string): Observable<HttpResponseInterface> {
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

    findOneSubject(id: string): Observable<SubjectState> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}