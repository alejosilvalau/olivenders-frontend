// TODO: This component was not checked yet
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Answer } from '../../../core/models/answer.interface.js';
import { Wand } from '../../../core/models/wand.interface.js';
import { Wizard } from '../../../core/models/wizard.interface.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-card.component.html',
  styleUrl: './answer-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerCardComponent {
  @Input() answer!: Answer;

  get wand(): Wand | undefined {
    return typeof this.answer.wand === 'object' ? this.answer.wand as Wand : undefined;
  }

  get wizard(): Wizard | undefined {
    return typeof this.answer.wizard === 'object' ? this.answer.wizard as Wizard : undefined;
  }
}
