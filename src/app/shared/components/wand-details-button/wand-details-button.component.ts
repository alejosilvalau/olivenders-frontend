import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Wand } from '../../../core/models/wand.interface';
import { BottomSheetConfig } from '../../../core/models/bottom-sheet.interface.js';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-wand-details-button',
  standalone: true,
  templateUrl: './wand-details-button.component.html',
  styleUrls: ['./wand-details-button.component.css']
})
export class WandDetailsButtonComponent {
  @Input() wand!: Wand | null;
  @Output() details = new EventEmitter<Wand>();

  constructor(private bottomSheet: MatBottomSheet) { }

  openWandDetails(wand: Wand): void {
    const config: BottomSheetConfig<Wand> = {
      title: 'Wand Details',
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'length_inches', label: 'Length' },
        { key: 'description', label: 'Description' },
        { key: 'total_price', label: 'Price' },
        { key: 'wood.name', label: 'Wood' },
        { key: 'core.name', label: 'Core' },
      ],
      data: wand,
    };

    this.bottomSheet.open(BottomSheetComponent, { data: config });
  }
}
