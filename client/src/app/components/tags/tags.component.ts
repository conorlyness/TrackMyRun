import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  tags: string[] = [];
  defaultTags: string[] = [
    '5K',
    '10K',
    'Aerobic',
    'Anerobic',
    'Base',
    'Easy',
    'Half marathon',
    'Intervals',
    'Long run',
    'Marathon',
    'Race',
    'Recovery',
    'Shakeout',
    'Tempo',
    'Threshold',
  ];

  initialEditTags!: string[];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  @Output() chosenTags = new EventEmitter<string[]>();
  @Input() tagsToEdit!: string[];

  constructor(private cdr: ChangeDetectorRef) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.defaultTags.slice()
      )
    );
  }

  ngOnInit(): void {
    if (this.tagsToEdit?.length > 0) {
      //we are in the edit run dialog and need to populate any pre existing tags from before
      //create a shallow copy if the user cancels the edit run so we can set the intial tags back
      this.initialEditTags = this.tagsToEdit ? [...this.tagsToEdit] : [];
      this.tags = this.initialEditTags;
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.forEach((tag) => {
        if (tag === value) {
          //ensure no duplicate tags
          this.remove(value);
        }
      });
      this.tags.push(value);
      this.chosenTags.emit(this.tags);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.chosenTags.emit(this.tags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedTag = event.option.viewValue;
    this.tags.forEach((tag) => {
      if (tag === selectedTag) {
        //ensure no duplicate tags
        this.remove(selectedTag);
      }
    });
    this.tags.push(event.option.viewValue);
    this.chosenTags.emit(this.tags);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.defaultTags.filter((tag) =>
      tag.toLowerCase().includes(filterValue)
    );
  }
}
