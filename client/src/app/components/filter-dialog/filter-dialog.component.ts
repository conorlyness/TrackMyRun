import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  filters = this._formBuilder.group({
    last7: this.data.last7,
    last14: this.data.last14,
    last30: this.data.last30,
    distance: (this.data.distance.min, this.data.distance.max),
  });

  showDistancePanel: boolean = false;

  last7: any = this.filters.controls['last7'].value;
  last14: any = this.filters.controls['last14'].value;
  last30: any = this.filters.controls['last30'].value;
  minDistance: any = this.data.distance.min;
  maxDistance: any = this.data.distance.max;

  filtersToUse = [
    { controlName: 'last7', uiName: 'Last 7 days' },
    { controlName: 'last14', uiName: 'Last 14 days' },
    { controlName: 'last30', uiName: 'Last 30 days' },
    { controlName: 'distance', uiName: 'Distance' },
  ];

  noFilters: boolean = true;

  ngOnInit(): void {
    if (this.last7) {
      this.filters.controls['last14'].disable();
      this.filters.controls['last30'].disable();
      this.filters.controls['distance'].disable();
      this.noFilters = false;
      this.data.last7 = true;
    } else if (this.last14) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last30'].disable();
      this.filters.controls['distance'].disable();
      this.noFilters = false;
      this.data.last14 = true;
    } else if (this.last30) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last14'].disable();
      this.filters.controls['distance'].disable();
      this.noFilters = false;
      this.data.last30 = true;
    } else if (
      this.minDistance !== undefined &&
      this.maxDistance !== undefined
    ) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last14'].disable();
      this.filters.controls['last30'].disable();
      this.noFilters = false;
      this.showDistancePanel = true;
      this.minDistance = this.data.distance.min;
      this.maxDistance = this.data.distance.max;
    }
  }

  checkboxChanged(checkbox: string, checked: boolean) {
    this.showDistancePanel = false;
    console.log(checkbox, checked);

    if (checkbox == 'last7' && checked == true) {
      this.filters.controls['last14'].disable();
      this.filters.controls['last30'].disable();
      this.filters.controls['distance'].disable();
      this.minDistance = undefined;
      this.maxDistance = undefined;
      this.noFilters = false;
      this.data.last7 = true;
    } else if (checkbox == 'last14' && checked == true) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last30'].disable();
      this.filters.controls['distance'].disable();
      this.minDistance = undefined;
      this.maxDistance = undefined;
      this.noFilters = false;
      this.data.last14 = true;
    } else if (checkbox == 'last30' && checked == true) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last14'].disable();
      this.filters.controls['distance'].disable();
      this.minDistance = undefined;
      this.maxDistance = undefined;
      this.noFilters = false;
      this.data.last30 = true;
    } else if (checkbox == 'distance' && checked == true) {
      this.filters.controls['last7'].disable();
      this.filters.controls['last14'].disable();
      this.filters.controls['last30'].disable();
      this.showDistancePanel = true;
      this.noFilters = false;
      this.data.distance = { min: this.minDistance, max: this.maxDistance };
    } else {
      this.filters.enable();
      this.data.last7 = false;
      this.data.last14 = false;
      this.data.last30 = false;
      this.data.distance = { min: undefined, max: undefined };
      this.noFilters = true;
    }
  }

  onNoClick(): void {
    this.data.cancel = true;
    this.dialogRef.close(this.data);
  }

  resetToDefault() {
    this.showDistancePanel = false;
    this.data.last7 = false;
    this.data.last14 = false;
    this.data.last30 = false;
    this.data.distance = { min: undefined, max: undefined };
    this.data.resetToDefault = true;
  }

  closeDialog(data: any, reset?: boolean) {
    this.dialogRef.close(data);
    if (reset) {
      this.resetToDefault();
    }
  }
}
