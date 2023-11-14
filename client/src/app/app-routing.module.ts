import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { RunLogComponent } from './components/run-log/run-log.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { RunScheduleComponent } from './components/run-schedule/run-schedule.component';

const routes: Routes = [
  { path: '', component: RunLogComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'fixtures', component: FixturesComponent },
  { path: 'schedule', component: RunScheduleComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
