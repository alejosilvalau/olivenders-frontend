import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-button',
  standalone: true,
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
  @Input() modalTarget: string = '';
  @Input() buttonText: string = 'Add';
}
