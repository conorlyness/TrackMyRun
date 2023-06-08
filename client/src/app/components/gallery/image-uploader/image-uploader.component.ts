import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from 'src/app/services/image.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
const URL = environment.imageUploadUrl;

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });
  fileNameDisplay?: File;
  description: string = '';
  addOnBlur: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  imgTags: string[] = [];

  constructor(
    private toast: ToastrService,
    private dialogRef: MatDialogRef<ImageUploaderComponent>,
    private imgService: ImageService
  ) {}

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any) => {
      //now that the upload is complete in the local folder
      //we can now send the details off to the db

      this.imgService
        .uploadNewImg(response, this.description, this.imgTags)
        .subscribe((res) => {
          console.log('res from upload new img::', res);
          this.fileNameDisplay = undefined;
          this.imgTags = [];
          this.description = '';
          this.toast.success('Image uploaded successfully');
          this.dialogRef.close('getAllImages');
        });
      // this.getAllImages();
    };
  }

  onFileSelected(event: any) {
    const file: File = event[0].name;
    this.fileNameDisplay = file;
  }

  upload() {
    //this will upload it to the local folder
    this.uploader.uploadAll();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancelUpload() {
    this.onNoClick();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our tag
    if (value) {
      this.imgTags.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: any): void {
    const index = this.imgTags.indexOf(tag);

    if (index >= 0) {
      this.imgTags.splice(index, 1);
    }
  }
}
