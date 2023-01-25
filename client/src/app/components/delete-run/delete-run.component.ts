import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-delete-run',
  templateUrl: './delete-run.component.html',
  styleUrls: ['./delete-run.component.scss'],
})
export class DeleteRunComponent implements OnInit {
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  deleteRun() {
    this.delete.emit(true);
  }

  cancelDelete() {
    this.delete.emit(false);
  }
}
