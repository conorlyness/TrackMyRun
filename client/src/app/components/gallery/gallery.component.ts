import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ImageService } from 'src/app/services/image.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { Image } from 'src/app/types';
const URL = environment.imageUploadUrl;

export interface DialogData {
  image: string;
  description: string;
  tags: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  animations: [
    trigger('imageTransition', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class GalleryComponent implements OnInit {
  constructor(
    private imageService: ImageService,
    public dialog: MatDialog,
    private toast: ToastrService
  ) {}

  allImages: Image[] = [];
  dialogAnswer: any;
  search: string = '';
  original: Image[] = [];
  fileUpload: boolean = false;
  showCarousel: boolean = false;
  isSearchMode: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

  ngOnInit(): void {
    this.getAllImages();
  }

  getAllImages() {
    this.imageService.getAllImages().subscribe((images) => {
      images.forEach((image: any) => {
        const imgTags = image.tags.split(',');
        image.tags = imgTags;
      });
      console.log(images);
      this.allImages = images;
      this.original = this.allImages;
      this.showCarousel = true;
    });
  }

  viewSpecificImage(img: any) {
    console.log('specific::', img);
    const imgObj = {
      image: img.url,
      description: img.description,
      tags: img.tags,
    };
    this.openDialog(imgObj);
  }

  openDialog(data: any) {
    this.dialog.open(ImageViewerComponent, {
      data: {
        image: data.image,
        description: data.description,
        tags: data.tags,
      },
    });
  }

  openUploader() {
    this.fileUpload = !this.fileUpload;
    const dialogRef = this.dialog.open(ImageUploaderComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'getAllImages') {
        this.getAllImages();
      }
    });
  }

  filterSearch(search: string) {
    console.log('filter search with:', search);
    let searchTerm = search.toLowerCase();

    let filteredImages = this.original.filter((img: any) => {
      const descriptionMatch = img.description
        .toLowerCase()
        .includes(searchTerm);
      const tagsMatch = img.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm)
      );
      return descriptionMatch || tagsMatch;
    });

    this.allImages = filteredImages;
  }

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.search = '';
    this.filterSearch('');
  }
}
