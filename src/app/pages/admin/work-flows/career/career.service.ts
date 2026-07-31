import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {HttpResponseInterface} from "@utils/interfaces";
import {map} from "rxjs/operators";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {CareerInterface, CareerState} from "./career.state";

@Injectable({providedIn: 'root'})
export class CareerService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/career`;

    createCareer(payload: CareerState): Observable<CareerInterface> {
        const url = this.apiUrl;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    updateCareer(id: string, payload: CareerState): Observable<CareerInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map((response) => response.data)
        );
    }

    deleteCareer(id: string): Observable<CareerInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }

    findCareers(page = 1, search = ''): Observable<HttpResponseInterface> {
        const url = this.apiUrl;

        let params = new HttpParams()
            .append('page', page);

        if (search) {
            params = params.append('search', search);
        }

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => response)
        );
    }

    findCareer(id: string): Observable<CareerInterface> {
        const url = `${this.apiUrl}/${id}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => response.data)
        );
    }
}
