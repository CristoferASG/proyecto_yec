import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {concatMap, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '@modules/auth/auth.service';
import {SignInResponseInterface} from '@modules/auth/interfaces';
import {CatalogueHttpService, CatalogueService, DpaHttpService} from '@utils/services';
import {DpaService} from "@utils/services/dpa.service";
import {SignInData, SignInState} from "@modules/auth/components/sign-in/sign-in.state";
import {forkJoin} from "rxjs";

@Injectable(
    {providedIn: 'root'}
)
export class SignInService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = environment.API_URL;

    private readonly authService = inject(AuthService);
    private readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly dpaService = inject(DpaService);

    signIn(payload: SignInState) {
        console.log('singin Service');
        const url = `${this.apiUrl}/auth/sign-in`;

        return forkJoin({
            catalogues: this.catalogueHttpService.findCache(),
            modelCatalogues: this.catalogueHttpService.findCacheModelCatalogues(),
            dpa: this.dpaHttpService.findCache()
        }).pipe(
            tap(({ catalogues, modelCatalogues, dpa }) => {
                this.catalogueService.setCatalogues(catalogues);
                this.catalogueService.setModelCatalogues(modelCatalogues);
                this.dpaService.setDpa(dpa);
            }),
            switchMap(() =>
                this.httpClient.post<SignInResponseInterface>(url, payload.signInData)
            ),
            tap(response => {
                const { data } = response;
                this.authService.accessToken = data.accessToken;
                this.authService.refreshToken = data.refreshToken;
                this.authService.auth = data.auth;
                this.authService.roles = data.roles;

                if (data.roles.length === 1) {
                    this.authService.role = data.roles[0];
                }
            }),
            map(response => response.data)
        );
    }

}
