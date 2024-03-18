import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ElectronService } from './services/electron.service';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ServerFailedComponent } from './components/server-failed/server-failed.component';

@NgModule({
  declarations: [AppComponent, LoadingComponent, MoreInfoComponent, ServerFailedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent],
})
export class AppModule {}
