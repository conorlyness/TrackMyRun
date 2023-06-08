import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Image } from '../types';

interface carouselContext {
  $implicit: Image[];
  currentImage: Image;
  currentIdx: number;
  controller: { next: (isManual: boolean) => void; prev: () => void };
}

@Directive({
  selector: '[carousel]',
})
export class CarouselDirective implements OnInit, OnDestroy {
  @Input() carousel: Image[] = [];
  currentIdx: number = 0;
  interval: any;

  constructor(
    private vcr: ViewContainerRef,
    private tmpl: TemplateRef<carouselContext>
  ) {}

  ngOnInit(): void {
    this.createView(this.currentIdx);
    this.startAutoCarousel();
  }

  createView(index: number) {
    this.vcr.clear();
    this.vcr.createEmbeddedView(this.tmpl, {
      $implicit: this.carousel,
      currentImage: this.carousel[index],
      currentIdx: this.currentIdx,
      controller: {
        next: (isManual: boolean) => this.nextImage(isManual),
        prev: () => this.prevImage(),
      },
    });
  }

  startAutoCarousel() {
    this.interval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  nextImage(isManual?: boolean) {
    if (isManual) {
      clearInterval(this.interval);
      this.startAutoCarousel();
    }

    let carouselLength = this.carousel.length;
    if (this.currentIdx < carouselLength - 1) {
      this.currentIdx++;
      this.createView(this.currentIdx);
    } else {
      this.currentIdx = 0;
      this.createView(this.currentIdx);
    }
  }

  prevImage() {
    clearInterval(this.interval);
    let carouselLength = this.carousel.length;
    if (this.currentIdx == 0) {
      this.currentIdx = this.carousel.length - 1;
      this.createView(this.currentIdx);
    } else {
      this.currentIdx--;
      this.createView(this.currentIdx);
    }
    this.startAutoCarousel();
  }

  ngOnDestroy(): void {
    this.vcr.clear();
  }
}
