import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-effort-slider',
  templateUrl: './effort-slider.component.html',
  styleUrls: ['./effort-slider.component.scss'],
})
export class EffortSliderComponent implements OnInit {
  max: number = 10;
  min: number = 1;
  step: number = 1;
  thumbLabel: boolean = false;
  showTicks: boolean = true;
  private _value: number = 1;
  @Output() effortValue: EventEmitter<number> = new EventEmitter();
  @Input() set value(value: number) {
    this._value = value;
  }
  get value() {
    return this._value;
  }

  constructor() {}

  ngOnInit(): void {
    this.effortValue.emit(this.value);
  }

  effortLabel() {
    return this.value;
  }

  emitEffort(rpe: MatSliderChange) {
    const val = rpe.value;
    if (val) {
      this.effortValue.emit(val);
    }
  }
}
