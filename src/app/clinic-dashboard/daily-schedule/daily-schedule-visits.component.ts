import { Component, OnInit, OnDestroy, OnChanges, Input,
SimpleChange, EventEmitter } from '@angular/core';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { DailyScheduleResourceService } from '../../etl-api/daily-scheduled-resource.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as Moment from 'moment';
import { LocalStorageService } from './../../utils/local-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'daily-schedule-visits',
  templateUrl: './daily-schedule-visits.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleVisitsComponent implements OnInit, OnDestroy {

  @Input() public selectedDate: any;
  public errors: any[] = [];
  public dailyVisitsPatientList: any[] = [];
  public loadingDailyVisits: boolean = false;
  public dataLoaded: boolean = false;
  public currentTabLoaded: boolean = false;
  public selectedVisitTab: any;
  public nextStartIndex: number = 0;
  public params: any =  {
    'programType': '',
    'visitType': '',
    'encounterType': '',
    'startDate': Moment().format('YYYY-MM-DD')
  };
  public fetchCount: number = 0;
  @Input() public tab: any;
  @Input() public newList: any;

  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  private selectedClinic: any;
  private currentClinicSubscription: Subscription= new Subscription();
  private selectedDateSubscription: Subscription;
  private visitsSubscription: Subscription;
  constructor(private clinicDashboardCacheService: ClinicDashboardCacheService,
              private dailyScheduleResource: DailyScheduleResourceService,
              private localStorageService: LocalStorageService,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    console.log('Load Daily Visits');
    this.selectedDate = Moment().format('YYYY-MM-DD');
    this.currentClinicSubscription = this.clinicDashboardCacheService.getCurrentClinic()
      .subscribe((location) => {
        this.selectedClinic = location;
      });

    this.route
      .queryParams
      .subscribe((params) => {
        console.log('subscribe params', params);
        this.initParams();
        if (params.startDate) {
            this.params = params;
            console.log('Visits Params', params);
        }
        let searchParams = this.getQueryParams();
        console.log('getDailyVisits');
        this.getDailyVisits(searchParams);
      });
  }

  public ngOnDestroy(): void {
    this.currentClinicSubscription.unsubscribe();
  }

  public loadMoreVisits() {

    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    let params = this.getQueryParams();
    this.getDailyVisits(params);

  }

  public getQueryParams() {
    return {
      startDate: this.params.startDate,
      startIndex: 0,
      locationUuids: this.selectedClinic,
      programType: this.params.programType,
      visitType: this.params.visitType,
      encounterType: this.params.encounterType,
      limit: 300
    };

  }

  private initParams() {
    this.loadingDailyVisits = false;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    this.dataLoaded = false;
    this.nextStartIndex = 0;
    this.errors = [];
    this.dailyVisitsPatientList = [];
  }

  private getDailyVisits(params) {
    this.loadingDailyVisits = true;
    this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
    let result = this.dailyScheduleResource.
      getDailyVisits(params);

    if (result === null) {
      throw new Error('Null daily appointments observable');
    } else {
      this.visitsSubscription = result.subscribe(
        (patientList) => {
          if (patientList.length > 300) {
            let size: number = patientList.length;
            this.nextStartIndex = this.nextStartIndex + size;
            this.currentTabLoaded = true;
          } else {
            this.dataLoaded = true;
          }
          this.dailyVisitsPatientList = this.dailyVisitsPatientList.concat(
            patientList);
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
        }
        ,
        (error) => {
          this.loadingDailyVisits = false;
          this.clinicDashboardCacheService.setIsLoading(this.loadingDailyVisits);
          this.dataLoaded = true;
          this.errors.push({
            id: 'Daily Visits',
            message: 'error fetching daily visits'
          });
        }
      );
    }
  }



}
