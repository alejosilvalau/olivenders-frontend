import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalConfig } from '../../../core/models/modal.interface';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() config: ModalConfig = {
    id: '',
    title: '',
    submitButtonText: 'Submit',
    cancelButtonText: 'Cancel'
  };

  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  @ContentChild('modalContent') modalContentTemplate!: TemplateRef<any>;

  submit(): void {
    this.onSubmit.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
