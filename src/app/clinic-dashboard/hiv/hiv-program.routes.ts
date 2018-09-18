import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HivModuleComponent } from './hiv-program.component';
import { Moh731ReportComponent } from './moh-731/moh-731-report.component';
import {
    HivSummaryIndicatorComponent
} from './hiv-summary-indicators/hiv-summary-indicator.component';
import {
    HivSummaryIndicatorsPatientListComponent
} from '../../hiv-care-lib/hiv-summary-indicators/patient-list.component';
import {
    PatientsRequiringVLComponent
} from './patients-requiring-vl/patients-requiring-vl.component';
import { HivCareComparativeComponent
} from './hiv-visualization/hiv-care-overview.component';
import {
    PatientStatusChangeVisualizationContainerComponent
} from
'./patient-status-change-visualization/patient-status-change-visualization.container.component';
import { PatientStatusChangeListComponent } from
'./patient-status-change-visualization/patient-status-change-list.component';
import {
  VisualizationPatientListComponent
} from '../../hiv-care-lib/hiv-visualization/visualization-patient-list.component';
import { Moh731PatientListComponent } from
'./../../hiv-care-lib/moh-731-report/moh-731-patientlist.component';
import {
    HivDailyScheduleComponent
} from './daily-schedule/daily-schedule.component';
import {
    HivMonthlyScheduleComponent
} from './monthly-schedule/monthly-schedule.component';
import { DailyScheduleVisitsComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-visits.component';
import { DailyScheduleAppointmentsComponent }
  from '../../clinic-schedule-lib/daily-schedule/daily-schedule-appointments.component';
import { DailyScheduleNotReturnedComponent
} from '../../clinic-schedule-lib/daily-schedule/daily-schedule-not-returned.component';
import { DailyScheduleClinicFlowComponent
} from '../hiv/clinic-flow/daily-schedule-clinic-flow.component';
import { ClinicFlowVisitsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-visits.component';
import {
  ClinicFlowLocationStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-location-stats.component';
import {
  ClinicFlowProviderStatsComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-provider-stats.component';
import { ClinicFlowSummaryComponent
} from '../../hiv-care-lib/clinic-flow/clinic-flow-summary.component';

const routes: Routes = [
    {
        path: 'landing-page',
        component: Moh731ReportComponent // replace with landing page for module
    },
    {
        path: 'patient-status-change-visualization',
        children: [
          {
            path: ':view',
            component: PatientStatusChangeVisualizationContainerComponent
          },
          {
            path: ':view/patient-list',
            component: PatientStatusChangeListComponent
          },
          { path: '', redirectTo: 'cumulative', pathMatch: 'prefix' }
        ]
    },
    {
        path: 'moh-731-report',
        component: Moh731ReportComponent // replace with landing page for module
    },
    {
        path: 'moh-731-report/patient-list',
        component: Moh731PatientListComponent
    },
    {
        path: 'hiv-summary-indicator-report',
        children: [
            {
                path: '',
                component: HivSummaryIndicatorComponent
            },
            {
                path: 'patient-list/:indicator/:period/:gender/:age/:locationUuids',
                component: HivSummaryIndicatorsPatientListComponent,
            }
        ]
    },
    {
        path: 'patients-requiring-vl',
        component: PatientsRequiringVLComponent,
    },
    {
      path: 'hiv-comparative-chart',
      children: [
        {
          path: '',
          component: HivCareComparativeComponent
        },
        {
          path: 'patient-list/:report/:indicator/:period',
          component: VisualizationPatientListComponent
        }

      ]

    },
    {
        path: 'daily-schedule',
        component: HivDailyScheduleComponent,
        children: [
            { path: '', redirectTo: 'daily-appointments', pathMatch: 'prefix' },
            { path: 'daily-visits', component: DailyScheduleVisitsComponent },
            { path: 'daily-appointments', component: DailyScheduleAppointmentsComponent },
            { path: 'daily-not-returned', component: DailyScheduleNotReturnedComponent },
            {
              path: 'clinic-flow', component: DailyScheduleClinicFlowComponent,
              children: [
                { path: 'visits', component: ClinicFlowVisitsComponent },
                { path: '', component: ClinicFlowSummaryComponent },
                { path: 'provider-stats', component: ClinicFlowProviderStatsComponent },
                { path: 'location', component: ClinicFlowLocationStatsComponent },
                { path: '', redirectTo: 'summary', pathMatch: 'prefix' }
              ]
            }
          ]
    },
    {
        path: 'monthly-schedule',
        component: HivMonthlyScheduleComponent
    }
];

export const clinicDashboardHivRouting: ModuleWithProviders =
    RouterModule.forChild(routes);
