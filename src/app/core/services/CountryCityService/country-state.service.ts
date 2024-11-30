import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../models/interface/AppResponse';
import { CountryDto } from '../../models/interface/countryState/CountryDto';
import { StateDto } from '../../models/interface/countryState/StateDto';

@Injectable({
  providedIn: 'root',
})
export class CountryStateService {
  private Url = 'https://localhost:7035/api/CountryState';

  private http = inject(HttpClient);

  // Get All Countries
  GetAllCountries$(): Observable<AppResponse<CountryDto[]>> {
    return this.http.get<AppResponse<CountryDto[]>>(
      `${this.Url}/GetAllCountries`
    );
  }

  // Get all State by using Country Id
  GetAllStateByCountryId$(
    countryId: number
  ): Observable<AppResponse<StateDto[]>> {
    return this.http.get<AppResponse<StateDto[]>>(
      `${this.Url}/GetAllStatesByCountryId/${countryId}`
    );
  }
}
