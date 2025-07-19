import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-schools-management',
  imports: [],
  template: `<p>schools-management works!</p>`,
  styleUrl: './schools-management.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolsManagementComponent { }
