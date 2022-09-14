import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from 'src/app/services/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';
const URL = 'http://localhost:3001/api/upload';

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
    private snackBar: MatSnackBar
  ) {}

  allImages!: any;

  ngOnInit(): void {
    this.getAllImages();

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded File Details:', item);

      this.getAllImages();
    };
  }

  getAllImages() {
    this.imageService.getAllImages().subscribe((image) => {
      console.log('the images coming from the server: ', image);
      this.openSnackBar('Image Uploaded Successfully');
      this.allImages = image;
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }
}
