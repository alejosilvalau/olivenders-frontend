import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum AlertType {
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  @Input() message: string = '';
  @Input() type: AlertType = AlertType.Info;
  @Input() alertId: string = '';

  show: boolean = false;

  showAlert(message: string, type: AlertType): void {
    this.message = message;
    this.type = type;
    this.show = true;
    setTimeout(() => (this.show = false), 3000);
  }

  closeAlert() {
    this.show = false;
  }

}
