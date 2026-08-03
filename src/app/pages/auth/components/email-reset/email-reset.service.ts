import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {HttpResponseInterface} from '@modules/auth/interfaces';
import {Observable} from "rxjs";
import {EmailResetState} from "@modules/auth/components/email-reset/email-reset.state";

@Injectable(
    {providedIn: 'root'}
)
export class EmailResetService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = environment.API_URL;

    verifySecurityQuestionsAndResetEmail(userId: string, payload: EmailResetState): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/auth/${userId}/security-questions/verify`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload.emailResetData).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
