import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() icon!: string;
  @Input() border: boolean = false;
  @Input() matStyle!: string;
  @Input() hoverColour!: string;
  @Input() disabled!: boolean;
  @Input() customContent!: boolean;
  @Input() content!: string | number;
  @Input() customClass!: string;
  @Input() toolTip!: string;
  @Input() warning!: boolean;
  @Input() badge!: string;
  @Input() badgeHidden!: boolean;
  @Output() clickEvnt = new EventEmitter();
  @ViewChild('btn', { read: ElementRef }) btn!: ElementRef<HTMLButtonElement>;
  darkTheme?: boolean;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.darkTheme = this.themeService.getTheme();
    this.themeService.theme$?.subscribe((theme) => {
      this.darkTheme = theme;
    });
  }

  onClick() {
    this.clickEvnt.emit();
  }

  onMouseOver() {
    this.btn.nativeElement.style.backgroundColor = this.hoverColour;
  }

  onMouseLeave() {
    this.btn.nativeElement.style.backgroundColor = '';
  }
}
