import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HomeComponent } from './components/home/home.component';
import { RunLogComponent } from './components/run-log/run-log.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'log', component: RunLogComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
