import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../../../core/services/question.service';
import { Question, QuestionResponse } from '../../../core/models/question.interface';
import { Observable } from 'rxjs';
import { SearcherComponent } from '../../../shared/components/searcher/searcher.component';
import { AlertComponent, AlertType } from '../../../shared/components/alert/alert.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component.js';
import { AddButtonComponent } from '../../../shared/components/add-button/add-button.component.js';
import { ModalComponent } from '../../../shared/components/modal/modal.component.js';

@Component({
  selector: 'app-questions-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SearcherComponent, AlertComponent, DataTableComponent, AddButtonComponent, ModalComponent],
  templateUrl: './questions-management.component.html',
  styleUrl: './questions-management.component.css'
})

export class QuestionsManagementComponent implements OnInit {
  questionForm: FormGroup = new FormGroup({});
  questions: Question[] = [];
  selectedQuestion: Question | null = null;
  filteredQuestions: Question[] = [];
  searchTerm: string = '';

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('') // optional
      ])
    });
  }

  ngOnInit(): void {
    this.findAllQuestions();
  }

  onQuestionSelected(q: Question): void {
    this.selectedQuestion = q;
    if (q) {
      this.questionForm.patchValue({
        question: q.question,
      });

      const optionsFormArray = this.optionsFormArray;
      optionsFormArray.clear();

      q.options.slice(0, 3).forEach(option => {
        optionsFormArray.push(this.fb.control(option, Validators.required));
      });
    }
  }

  get optionsFormArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  findAllQuestions(): void {
    this.questionService.findAll().subscribe((questionResponse: QuestionResponse<Question[]>) => {
      this.questions = questionResponse.data!;
      this.filteredQuestions = questionResponse.data!;
    });
  }

  private searchQuestion(term: string): void {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      this.filteredQuestions = [];
      return;
    }

    this.questionService.findOne(trimmedTerm).subscribe({
      next: res => {
        this.filteredQuestions = res.data ? [res.data] : [];
      },
      error: err => {
        this.filteredQuestions = [];
        this.alertComponent.showAlert(err.error.message || 'Question not found', AlertType.Error);
      }
    });
  }

  onSearch(filteredQuestions: Question[]): void {
    if (filteredQuestions.length > 0) {
      this.filteredQuestions = filteredQuestions;
      return;
    }
    this.searchQuestion(this.searchTerm);
  }

  private formatQuestionData(): { question: string; options: string[] } {
    const { question } = this.questionForm.value;
    const options = this.optionsFormArray.value.filter((opt: string) => !!opt); // Filter out empty options
    return {
      question,
      options
    };
  }

  addQuestion(): void {
    if (this.questionForm.valid) {
      const questionData = this.formatQuestionData();
      this.questionService.add(questionData).subscribe({
        next: (res: QuestionResponse) => {
          this.alertComponent.showAlert(res.message, AlertType.Success);
          this.findAllQuestions();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.error.message || 'Error adding the question', AlertType.Error);
        }
      });
      this.questionForm.reset();
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
  }

  editQuestion(): void {
    if (this.selectedQuestion) {
      const questionData = this.formatQuestionData();
      this.questionService.update(this.selectedQuestion.id, questionData).subscribe({
        next: (response: QuestionResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllQuestions();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error updating the question', AlertType.Error);
        }
      });
      this.questionForm.reset();
    }
  }

  removeQuestion(): void {
    if (this.selectedQuestion) {
      this.questionService.remove(this.selectedQuestion.id).subscribe({
        next: (response: QuestionResponse) => {
          this.alertComponent.showAlert(response.message, AlertType.Success);
          this.findAllQuestions();
        },
        error: (err: any) => {
          this.alertComponent.showAlert(err.message || 'Error deleting the question', AlertType.Error);
        }
      });
      this.questionForm.reset();
    }
  }
}
