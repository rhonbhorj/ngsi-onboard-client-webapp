import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  handleApiError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.status === 0) {
      userMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.status === 400) {
      userMessage = 'Invalid data submitted. Please check your information.';
    } else if (error.status === 401) {
      userMessage = 'Authentication required. Please log in again.';
    } else if (error.status === 403) {
      userMessage = 'Access denied. You don\'t have permission for this action.';
    } else if (error.status === 404) {
      userMessage = 'Resource not found. Please check the URL.';
    } else if (error.status === 500) {
      userMessage = 'Server error. Please try again later.';
    } else if (error.status >= 500) {
      userMessage = 'Server is temporarily unavailable. Please try again later.';
    }
    
    // You can integrate with a toast/notification service here
    alert(userMessage);
  }
  
  handleValidationError(error: any): string[] {
    const errors: string[] = [];
    
    if (error.error && error.error.errors) {
      Object.keys(error.error.errors).forEach(key => {
        errors.push(error.error.errors[key].join(', '));
      });
    } else if (error.error && error.error.message) {
      errors.push(error.error.message);
    } else {
      errors.push('Validation failed. Please check your input.');
    }
    
    return errors;
  }
}
