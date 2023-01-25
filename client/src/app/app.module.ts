import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  LogRunComponent,
  RunInfoDialog,
} from './components/log-run/log-run.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MaterialExampleModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { RunLogComponent } from './components/run-log/run-log.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ToastrModule } from 'ngx-toastr';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ExportDialogComponent } from './components/export-dialog/export-dialog.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MonthYearSelectsComponent } from './components/month-year-selects/month-year-selects.component';
import { NgxElectronModule } from 'ngx-electron';
import { ButtonComponent } from './components/button/button.component';
import { DeleteRunComponent } from './components/delete-run/delete-run.component';

@NgModule({
  declarations: [
    AppComponent,
    LogRunComponent,
    RunInfoDialog,
    RunLogComponent,
    GalleryComponent,
    EditDialogComponent,
    FilterDialogComponent,
    DateRangePickerComponent,
    ExportDialogComponent,
    AnalyticsComponent,
    MonthYearSelectsComponent,
    ButtonComponent,
    DeleteRunComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatInputModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatSortModule,
    MatCardModule,
    FileUploadModule,
    MatTableExporterModule,
    MatGridListModule,
    MatSlideToggleModule,
    NgxElectronModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
