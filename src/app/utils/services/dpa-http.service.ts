import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import {DpaInterface, HttpResponseInterface} from "@utils/interfaces";

@Injectable({
    providedIn: 'root'
})
export class DpaHttpService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/common/dpa`;

    findCache(): Observable<DpaInterface[]> {
        const url = `${this.apiUrl}/cache`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
