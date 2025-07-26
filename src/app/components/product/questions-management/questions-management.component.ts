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
  styleUrl: '../../../shared/styles/management.style.css'
})

export class QuestionsManagementComponent implements OnInit {
  questionForm: FormGroup = new FormGroup({});
  questions: Question[] = [];
  selectedQuestion: Question | null = null;
  filteredQuestions: Question[] = [];
  searchTerm: string = '';
  maxOptions: number = 3;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  ngOnInit(): void {
    this.findAllQuestions();
  }

  get optionsFormArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  onQuestionSelected(question: Question): void {
    this.selectedQuestion = question;
    if (question) {
      this.questionForm.patchValue({ ...question });
    }
  }

  addOption(): void {
    if (this.optionsFormArray.length < this.maxOptions) {
      this.optionsFormArray.push(this.fb.control(''));
    } else {
      console.warn(`Maximum of ${ this.maxOptions } options reached.`);
    }
  }

  updateOption(index: number, value: string): void {
    const control = this.optionsFormArray.at(index);
    if (control) {
      control.setValue(value.trim());
      if (!value.trim()) {
        this.optionsFormArray.removeAt(index);
      }
    }
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
    const { question, options } = this.questionForm.value;
    const questionData = {
      question,
      options: options.filter((opt: string) => !!opt)
    };
    return questionData;
  }

  private clearOptionsFormArray(): void {
    // Clear all empty options
    for (let i = this.optionsFormArray.length - 1; i >= 0; i--) {
      const control = this.optionsFormArray.at(i);
      if (control.value.trim() === '') {
        this.optionsFormArray.removeAt(i);
      }
    }

    // Ensure at least two empty options
    while (this.optionsFormArray.length < 2) {
      this.optionsFormArray.push(this.fb.control('', Validators.required));
    }
  }


  cancelAddQuestion(): void {
    this.clearOptionsFormArray();
    this.questionForm.reset();
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
    } else {
      this.alertComponent.showAlert('Please complete all required fields.', AlertType.Error);
    }
    this.clearOptionsFormArray();
    this.questionForm.reset();
  }

  cancelEditQuestion(): void {
    this.clearOptionsFormArray();
    this.questionForm.reset();
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
      this.selectedQuestion = null;
    }
    this.clearOptionsFormArray();
    this.questionForm.reset();
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
      this.selectedQuestion = null;
    }
  }
}
