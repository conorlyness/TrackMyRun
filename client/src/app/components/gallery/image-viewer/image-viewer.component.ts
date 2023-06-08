import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogData } from '../gallery.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  // Set the initial zoom level
  zoomLevel: number = 100;
  @ViewChild('img') image!: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  zoomIn() {
    this.zoomLevel += 10;
    this.image.nativeElement.style.transform = `scale(${this.zoomLevel / 100})`;
  }

  zoomOut() {
    this.zoomLevel -= 10;
    this.image.nativeElement.style.transform = `scale(${this.zoomLevel / 100})`;
  }
}
