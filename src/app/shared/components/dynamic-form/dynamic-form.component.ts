import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DynamicFormConfig, FormField } from './dynamic-form.models';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  imports: [
    CommonModule, ReactiveFormsModule, TranslateModule,
    InputTextModule, InputNumberModule, PasswordModule,
    InputTextarea, DropdownModule, MultiSelectModule,
    CalendarModule, CheckboxModule, ToggleButtonModule, RadioButtonModule,
    ButtonModule, CardModule
  ]
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() config!: DynamicFormConfig;
  @Input() initialValues?: Record<string, any>;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  private _sortedFields: FormField[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.buildForm();
    }
    if (changes['initialValues'] && this.form) {
      this.patchValues();
    }
  }

  private buildForm(): void {
    const controls: Record<string, FormControl> = {};
    const sorted = [...(this.config?.fields ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const field of sorted) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validators) validators.push(...field.validators);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (field.type === 'email') validators.push(Validators.email);
      const defaultVal = field.defaultValue ?? (field.type === 'checkbox' || field.type === 'toggle' ? false : (field.type === 'multiSelect' ? [] : ''));
      controls[field.key] = new FormControl({ value: defaultVal, disabled: field.disabled ?? false }, validators);
    }
    this.form = this.fb.group(controls);
    this._sortedFields = sorted;
    if (this.initialValues) {
      this.patchValues();
    }
  }

  private patchValues(): void {
    if (this.initialValues && this.form) {
      this.form.patchValue(this.initialValues);
    }
  }

  isVisible(field: FormField): boolean {
    if (!field.showIf) return true;
    return field.showIf(this.form?.value ?? {});
  }

  getError(key: string): string | null {
    const ctrl = this.form?.get(key);
    if (!ctrl || !ctrl.touched || !ctrl.errors) return null;
    if (ctrl.errors['required']) return 'FORM.REQUIRED';
    if (ctrl.errors['email']) return 'FORM.INVALID_EMAIL';
    if (ctrl.errors['minlength']) return 'FORM.MIN_LENGTH';
    if (ctrl.errors['maxlength']) return 'FORM.MAX_LENGTH';
    if (ctrl.errors['min']) return 'FORM.MIN_VALUE';
    if (ctrl.errors['max']) return 'FORM.MAX_VALUE';
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.getRawValue());
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  get sortedFields(): FormField[] {
    return this._sortedFields;
  }
}
