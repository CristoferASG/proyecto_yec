import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {SubjectState} from "./subject.state";

@Injectable({providedIn: 'root'})
export class SubjectService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/career-coordinator/subjects`;

    createSubject(payload: SubjectState) {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    updateSubject(id: string, payload: SubjectState) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    deleteSubject(id: string) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    findSubjects(page: number, search: string): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        let params = new HttpParams()
            .append('page', page)
            .append('limit', 10)
            .append('sort', 'name');

        if (search) {
            params = params.append('search', search);
        }

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => response)
        );
    }

    findSubject(id: string): Observable<SubjectState> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }
}
