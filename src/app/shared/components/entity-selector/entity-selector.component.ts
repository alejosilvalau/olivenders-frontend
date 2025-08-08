import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entity-selector',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './entity-selector.component.html',
  styleUrl: '../../styles/forms.style.css',
})
export class EntitySelectorComponent implements OnInit {
  @Input() entityControl!: FormControl;
  @Input() service!: any;
  @Input() findOneByString?: (term: string) => any;
  @Input() label: string = 'Entity';
  @Input() placeholder: string = 'Search by name or ID';
  @Input() displayField: string = 'name';
  @Input() pageSize: number = Number.MAX_SAFE_INTEGER;

  @Output() entitySelected = new EventEmitter<any>();
  @ViewChild('selectorRoot', { static: true }) selectorRoot!: ElementRef;

  filteredEntities: any[] = [];
  showDropdown: boolean = false;
  selectedEntityName: string = '';

  ngOnInit(): void {
    this.entityControl.valueChanges.subscribe(value => {
      if (!value) {
        this.selectedEntityName = '';
        this.filteredEntities = [];
        this.showDropdown = false;
      } else {
        this.service.findOne(value).subscribe((res: any) => {
          if (res.data) {
            this.selectedEntityName = res.data[this.displayField];
          }
        });
      }
    });
  }

  onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value.trim();
    this.selectedEntityName = term;
    if (!term) {
      const page = 1;
      this.service.findAll(page, this.pageSize).subscribe((res: any) => {
        this.filteredEntities = res.data || [];
        this.showDropdown = true;
      });
    } else {
      const isObjectId = /^[a-f\d]{24}$/i.test(term);
      let search$;
      if (!isObjectId && this.findOneByString) {
        search$ = this.findOneByString(term);
      }
      search$ = this.service.findOne(term);

      search$.subscribe({
        next: (res: any) => {
          this.filteredEntities = res.data ? [res.data] : [];
          this.showDropdown = true;
        },
        error: () => {
          this.filteredEntities = this.filteredEntities.filter(entity =>
            entity[this.displayField].toLowerCase().includes(term.toLowerCase())
          );
        }
      });
    }
  }

  onFocus(): void {
    if (!this.selectedEntityName) {
      const pageNumber = 1;
      this.service.findAll(pageNumber, this.pageSize).subscribe((res: any) => {
        this.filteredEntities = res.data || [];
        this.showDropdown = true;
      });
    }
  }

  selectEntity(entity: any): void {
    this.entityControl.setValue(entity["id"]);
    this.selectedEntityName = entity[this.displayField];
    this.entitySelected.emit(entity);
    this.showDropdown = false;
    this.filteredEntities = [];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.selectorRoot && !this.selectorRoot.nativeElement.contains(target)) {
      this.showDropdown = false;
    }
  }
}
