import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-wizard',
  imports: [],
  template: `<p>wizard works!</p>`,
  styleUrl: './wizard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent { }
