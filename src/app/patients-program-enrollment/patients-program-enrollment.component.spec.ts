import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PatientProgramEnrollmentService } from
    './../etl-api/patient-program-enrollment.service';
import { DepartmentProgramsConfigService } from
'./../etl-api/department-programs-config.service';
import { PatientProgramResourceService } from
'./../etl-api/patient-program-resource.service';
import { PatientsProgramEnrollmentComponent } from './patients-program-enrollment.component';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { DepartmentProgramFilterComponent } from
'./../department-program-filter/department-program-filter.component';
import { UserDefaultPropertiesService } from
'./../user-default-properties/user-default-properties.service';
import { UserService } from './../openmrs-api/user.service';
import { Observable } from 'rxjs/Observable';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { SessionStorageService } from './../utils/session-storage.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';
class MockRouter {
    public navigate = jasmine.createSpy('navigate');
   }
class MockActivatedRoute {
    public params = Observable.of([{ 'id': 1 }]);
    public snapshot = {
       queryParams: { date: '' }
     };
 }

const mockActiveEnrollmentsResult: any = [
  {
  'date_completed' : null,
  'death_date' : null,
  'enrolled_date' : '2018-02-28T21:00:00.000Z',
  'location_id' : 1,
  'patient_identifier' : '1321',
  'patient_name' : 'Test Patient 1',
  'patient_program_id' : '1',
  'person_id' : '1',
  'person_uuid' : 'f4788c37',
  'program_id' : '1',
  'program_name' : 'STANDARD HIV TREATMENT',
  'program_uuid' : 'uuid1'
  },
  {
    'date_completed' : null,
    'death_date' : null,
    'enrolled_date' : '2018-03-01T05:46:30.000Z',
    'location_id' : 1,
    'patient_identifier' : '1320',
    'patient_name' : 'Test Patient 2',
    'patient_program_id' : '2',
    'person_id' : '528495',
    'person_uuid' : 'f4788c38',
    'program_id' : '2',
    'program_name' : 'HIV DIFFERENTIATED CARE PROGRAM',
    'program_uuid' : 'uuid2'
    }

];

const mockDepartmentConfig = {
  'deptUuId1': {
    'name': 'HIV',
    'programs': [
      {
        'uuid': 'uuid1',
        'name': 'STANDARD HIV TREATMENT'
      },
      {
        'uuid': 'uuid2',
        'name': 'HIV DIFFERENTIATED CARE PROGRAM'
      }
    ]
  },
  'deptUuId2': {
    'name': 'OVC',
    'programs': [
      {
        'uuid': '781d8768',
        'name': 'OVC PROGRAM'
      }

    ]
  }

};

const mockPatientList = [
  { 
    no: 1, 
    name: 'Test Patient 1', 
    identifier: '1321', 
    program: 'STANDARD HIV TREATMENT( Enrolled - 28-Feb-2018)', 
    patient_uuid: 'f4788c37' 
  },
  {
    no: 2, 
    name: 'Test Patient 2', 
    identifier: '1320', 
    program: 'HIV DIFFERENTIATED CARE PROGRAM( Enrolled - 01-Mar-2018)',
    patient_uuid: 'f4788c38'
  }

];

const mockSummaryList = [
{
  dept : "HIV",
  enrolled : 1 ,
  program : "STANDARD HIV TREATMENT",
  programUuid : "uuid1"
},
{
  dept : "HIV",
  enrolled : 1 ,
  program : "HIV DIFFERENTIATED CARE PROGRAM",
  programUuid : "uuid2"
}

];

fdescribe('Component: Patient Program Enrollment', () => {
  let fixture: ComponentFixture<PatientsProgramEnrollmentComponent>;
  let patientProgramEnrollmentService: PatientProgramEnrollmentService;
  let localStorageService: LocalStorageService;
  let departmentProgramService: DepartmentProgramsConfigService;
  let patientProgramResourceService: PatientProgramResourceService;
  let route: ActivatedRoute;
  let router: Router;
  let cd: ChangeDetectorRef;
  let storage: Storage;
  let comp: any;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        FormsModule,
        AngularMultiSelectModule,
        DateTimePickerModule,
        IonicStorageModule.forRoot(),
        AgGridModule.withComponents([])
      ],
      declarations: [
        PatientsProgramEnrollmentComponent,
        DepartmentProgramFilterComponent
      ],
      providers: [
        Storage,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        PatientProgramEnrollmentService,
        DepartmentProgramsConfigService,
        PatientProgramResourceService,
        UserDefaultPropertiesService,
        SessionStorageService,
        UserService,
        LocationResourceService,
        AppFeatureAnalytics,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        MockBackend,
        BaseRequestOptions
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PatientsProgramEnrollmentComponent);
        comp = fixture.componentInstance;
        patientProgramEnrollmentService =
        fixture.debugElement.injector.get(PatientProgramEnrollmentService);
        departmentProgramService = fixture.debugElement.injector
        .get(DepartmentProgramsConfigService);
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        router = fixture.debugElement.injector.get(Router);

      });
  }));

  fit('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  fit('should generate patient list and summary list from enrolled list response', () => {
    comp.departmentProgConfig = mockDepartmentConfig;
    comp.processEnrollments(mockActiveEnrollmentsResult);
    cd.detectChanges();
    expect(comp.patientsEnrolledList).toEqual(mockPatientList);
    expect(comp.enrolledSummaryList).toEqual(mockSummaryList);
    expect(comp).toBeTruthy();
  });

});

