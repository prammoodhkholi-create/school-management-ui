import { CanDeactivateFn } from '@angular/router';
import { HasUnsavedChanges } from '../interfaces/has-unsaved-changes.interface';

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    // NOTE: Using window.confirm for now. In future, replace with PrimeNG ConfirmDialog.
    return window.confirm('You have unsaved changes. Are you sure you want to leave?');
  }
  return true;
};
