import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { RunLogComponent } from './components/run-log/run-log.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { RunScheduleComponent } from './components/schedule/run-schedule/run-schedule.component';
import { StravaComponent } from './components/strava/strava.component';

const routes: Routes = [
  { path: '', component: RunScheduleComponent },
  { path: 'log', component: RunLogComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'fixtures', component: FixturesComponent },
  { path: 'strava', component: StravaComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
