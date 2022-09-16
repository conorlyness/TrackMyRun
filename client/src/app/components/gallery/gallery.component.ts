import { Component, Inject, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from 'src/app/services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

const URL = 'http://localhost:3001/api/upload';

export interface DialogData {
  image: any;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  allImages!: any;
  dialogAnswer: any;

  ngOnInit(): void {
    this.getAllImages();

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);
      this.openSnackBar('Image Uploaded Successfully');
      this.getAllImages();
    };
  }

  getAllImages() {
    this.imageService.getAllImages().subscribe((image) => {
      console.log('the images coming from the server: ', image);
      this.allImages = image;
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

  viewInNewTab(img: any) {
    console.log('clicked: ', img);
    window.open(img, '_blank')?.focus();
  }

  viewSpecificImage(img: any) {
    const imgObj = { image: img };
    this.openDialog(imgObj);
  }

  openDialog(data: any) {
    this.dialog.open(ImageDialog, {
      height: '650px',
      width: '700px',
      panelClass: 'image-dialog',
      data: {
        image: data.image,
      },
    });
  }
}

@Component({
  selector: 'image-dialog',
  templateUrl: 'image-dialog.html',
  styleUrls: ['./gallery.component.scss'],
})
export class ImageDialog {
  constructor(
    public dialogRef: MatDialogRef<ImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
