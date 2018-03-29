import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { UserDefaultPropertiesService } from
'./../user-default-properties/user-default-properties.service';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';
import { DepartmentProgramFilterComponent } from './department-program-filter.component';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytcis.mock';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { UserService } from './../openmrs-api/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { SessionStorageService } from './../utils/session-storage.service';

const programsSelected = [
  {
     'id': '1',
     'itemName': 'TEST PROGRAM'
  }
];

const mocklocationSelected = [{
   'id': '1',
   'itemName': 'Test-location'
}];

const mockDepartmentSelected = [
  {
    'id': '1',
    'itemName': 'TEST Department'
 }

];
const mockDepartments = [
  {
    'id': '1',
    'itemName': 'TEST Department'
 },
 {
  'id': '2',
  'itemName': 'TEST Department 2'
}

];
const mockPrograms = [
  {
    'id': '1',
    'itemName': 'TEST PROGRAM'
  },
  {
    'id': '2',
    'itemName': 'TEST PROGRAM'
  }

];

const params = {
    'startDate': '2018-03-01',
    'endDate': '2018-03-31',
    'locationUuid': 1,
    'programType':  1,
    'department': mockDepartmentSelected

};

let selectedStartDate = '2018-03-01';
let selectedEndDate = '2018-03-31';

fdescribe('Component : DepartmentProgramFilter', () => {
    let fixture: ComponentFixture<DepartmentProgramFilterComponent>;
    let comp: DepartmentProgramFilterComponent;
    let patientProgramService: PatientProgramResourceService;
    let localStorageService: LocalStorageService;
    let departmentProgramService: DepartmentProgramsConfigService;
    let userDefaultService: UserDefaultPropertiesService;
    let locationResourceService: LocationResourceService;
    let storage: Storage;
    let cd: ChangeDetectorRef;

    beforeEach(async(() => {

    TestBed.configureTestingModule({
        imports:
        [
         AngularMultiSelectModule,
         FormsModule,
         DateTimePickerModule,
         IonicStorageModule.forRoot(),
        ],
        declarations: [
            DepartmentProgramFilterComponent
        ],
        providers: [
          PatientProgramResourceService,
          LocationResourceService,
          AppSettingsService,
          LocalStorageService,
          DepartmentProgramsConfigService,
          UserDefaultPropertiesService,
          LocationResourceService,
          SessionStorageService,
          CacheService,
          DataCacheService,
          UserService,
          Storage,
          {
            provide: Http,
            useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backendInstance, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
          {
            provide: AppFeatureAnalytics,
            useClass: FakeAppFeatureAnalytics
          },
          MockBackend,
          BaseRequestOptions
        ]
      }).compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DepartmentProgramFilterComponent);
          comp = fixture.componentInstance;
          patientProgramService = fixture.debugElement.injector.get(PatientProgramResourceService);
          localStorageService = fixture.debugElement.injector.get(LocalStorageService);
          userDefaultService = fixture.debugElement.injector.get(UserDefaultPropertiesService);
          departmentProgramService = fixture.debugElement.injector
          .get(DepartmentProgramsConfigService);
          locationResourceService = fixture.debugElement.injector.get(LocationResourceService);
          cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        });
      }));

    fit('should create an instance', () => {
      expect(comp).toBeTruthy();
    });

    fit('should set params and emit params on set filter', () => {
        comp.location = mocklocationSelected;
        comp.selectedStartDate = selectedStartDate;
        comp.selectedEndDate = selectedEndDate;
        comp.department = mockDepartmentSelected;
        comp.program = programsSelected;
        comp.location = mocklocationSelected;

        // expect(comp.params).toEqual();
        comp.setFilter();
    });

});
