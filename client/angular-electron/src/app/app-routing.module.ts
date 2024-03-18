import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { ServerFailedComponent } from './components/server-failed/server-failed.component';

const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: 'more', component: MoreInfoComponent },
  { path: 'serverFailed', component: ServerFailedComponent },
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
