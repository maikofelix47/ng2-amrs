import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';

@Injectable()
export class PatientProgramEnrollmentService {

  constructor(
     private _http: Http,
     private _appSettingsService: AppSettingsService,
     private _cacheService: DataCacheService) {
  }

  /*
   This service fetches patient enrollments based on
   location, date and program
  */
  public getBaseUrl(): string {
    return this._appSettingsService.getEtlRestbaseurl().trim() + `patient-enrollment`;
  }

  public getActivePatientEnrollments(payload: any): Observable<any> {

    if (!payload) {
         return null;
    }

    let urlParams: URLSearchParams = new URLSearchParams();

    urlParams.set('endDate', payload.endDate);
    urlParams.set('startDate', payload.startDate);
    urlParams.set('locationUuids', payload.locationUuid);
    if (payload.programType.length > 0) {
      urlParams.set('programType', payload.programType);
    }
    let url = this.getBaseUrl() + '/enrollment';
    let request = this._http.get(url, {
        search: urlParams
    })
        .map((response: Response) => {
            return response.json();
        });
    return this._cacheService.cacheRequest(url, urlParams, request);

  }
}
