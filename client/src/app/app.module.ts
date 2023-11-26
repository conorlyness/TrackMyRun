import { NgModule } from '@angular/core';
import { MaterialExampleModule } from '../material.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogRunComponent } from './components/log-run/log-run.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
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
import { ButtonComponent } from './components/button/button.component';
import { DeleteRunComponent } from './components/delete-run/delete-run.component';
import { EffortSliderComponent } from './components/effort-slider/effort-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageViewerComponent } from './components/gallery/image-viewer/image-viewer.component';
import { PersonalBestsComponent } from './components/personal-bests/personal-bests.component';
import { EditRecordComponent } from './components/personal-bests/edit-record/edit-record.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { ShoesComponent } from './components/shoes/shoes.component';
import { AddNewShoeComponent } from './components/shoes/add-new-shoe/add-new-shoe.component';
import { MatMenuModule } from '@angular/material/menu';
import { HighMileageComponent } from './components/shoes/high-mileage/high-mileage.component';
import { CarouselDirective } from './directives/carousel.directive';
import { MatChipsModule } from '@angular/material/chips';
import { ImageUploaderComponent } from './components/gallery/image-uploader/image-uploader.component';
import { ElectronService } from './services/electron.service';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { MatBadgeModule } from '@angular/material/badge';
import { TagsComponent } from './components/tags/tags.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RunScheduleComponent } from './components/schedule/run-schedule/run-schedule.component';
import { MonthPipe } from './pipes/month.pipe';
import { AddRunDialogComponent } from './components/schedule/add-run-dialog/add-run-dialog.component';
import { EditRunDialogComponent } from './components/schedule/edit-run-dialog/edit-run-dialog.component';
import { PreviewRunDialogComponent } from './components/schedule/preview-run-dialog/preview-run-dialog.component';
import { DeleteRunDialogComponent } from './components/schedule/delete-run-dialog/delete-run-dialog.component';
import { CompleteRunDialogComponent } from './components/schedule/complete-run-dialog/complete-run-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LogRunComponent,
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
    EffortSliderComponent,
    ImageViewerComponent,
    PersonalBestsComponent,
    EditRecordComponent,
    ShoesComponent,
    AddNewShoeComponent,
    HighMileageComponent,
    CarouselDirective,
    ImageUploaderComponent,
    FixturesComponent,
    TagsComponent,
    RunScheduleComponent,
    MonthPipe,
    AddRunDialogComponent,
    EditRunDialogComponent,
    PreviewRunDialogComponent,
    DeleteRunDialogComponent,
    CompleteRunDialogComponent,
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
    MatSliderModule,
    MatTooltipModule,
    MatExpansionModule,
    MatStepperModule,
    MatDividerModule,
    MatMenuModule,
    MatChipsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
    MaterialExampleModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, ElectronService],
  bootstrap: [AppComponent],
})
export class AppModule {}
