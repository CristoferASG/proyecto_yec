import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {InstitutionState} from "./institution.state";

@Injectable({providedIn: 'root'})
export class InstitutionService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/core/career-coordinator/institutions`;

    createInstitution(payload: InstitutionState) {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    updateInstitution(id: string, payload: InstitutionState) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    deleteInstitution(id: string) {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    findInstitutions(page: number, search: string): Observable<HttpResponseInterface> {
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

    findInstitution(id: string): Observable<InstitutionState> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }
}
