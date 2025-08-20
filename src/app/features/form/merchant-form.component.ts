import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MerchantOnboardingData,
  BusinessType,
  BusinessCategory,
  Country,
} from '../../models/merchant.component';

@Component({
  selector: 'app-merchant-onboarding',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class MerchantOnboardingComponent implements OnInit {
  activeIndex: number = 0;
  steps: string[] = ['Business Info', 'Address', 'Contact', 'Banking', 'Documents', 'Review'];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  showSuccessDialog: boolean = false;
  merchantId: string = '';

  businessInfoForm!: FormGroup;
  addressForm!: FormGroup;
  contactForm!: FormGroup;
  bankingForm!: FormGroup;
  documentsForm!: FormGroup;
  agreementsForm!: FormGroup;

  // Dropdown Mock Data
  businessTypes: BusinessType[] = [];
  businessCategories: BusinessCategory[] = [];
  countries: Country[] = [];
  employeeRanges = [
    { label: '1-5', value: '1-5' },
    { label: '6-20', value: '6-20' },
    { label: '21-50', value: '21-50' },
    { label: '51-100', value: '51-100' },
    { label: '101-500', value: '101-500' },
    { label: '500+', value: '500+' },
  ];

  accountTypes = [
    { label: 'Checking', value: 'checking' },
    { label: 'Savings', value: 'savings' },
    { label: 'Business Checking', value: 'business_checking' },
    { label: 'Business Savings', value: 'business_savings' },
  ];

  uploadedFiles: { [key: string]: File } = {};
  maxFileSize = 5000000; // 5MB

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  private initializeForms() {
    // Business Information Form
    this.businessInfoForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      businessCategory: ['', Validators.required],
      registrationNumber: ['', [Validators.required, Validators.minLength(6)]],
      taxId: ['', [Validators.required, Validators.minLength(9)]],
      yearEstablished: [
        '',
        [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())],
      ],
      numberOfEmployees: ['', Validators.required],
      website: [''],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });

    // Address Form
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
    });

    // Contact Form
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      alternatePhone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
    });

    // Banking Form
    this.bankingForm = this.fb.group({
      bankName: ['', [Validators.required, Validators.minLength(2)]],
      accountNumber: ['', [Validators.required, Validators.minLength(8)]],
      routingNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      accountType: ['', Validators.required],
      accountHolderName: ['', [Validators.required, Validators.minLength(2)]],
    });

    // Documents Form
    this.documentsForm = this.fb.group({
      businessLicense: [''],
      taxCertificate: [''],
      bankStatement: [''],
      identityDocument: [''],
    });

    // Agreements Form
    this.agreementsForm = this.fb.group({
      termsAccepted: [false, Validators.requiredTrue],
      privacyPolicyAccepted: [false, Validators.requiredTrue],
      processingAgreementAccepted: [false, Validators.requiredTrue],
      marketingConsent: [false],
    });
  }

  private loadDropdownData() {
    this.isLoading = true;

    // Mock data for now to avoid service dependency issues
    this.businessTypes = [
      { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
      { label: 'Partnership', value: 'partnership' },
      { label: 'Limited Liability Company (LLC)', value: 'llc' },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Organization', value: 'non_profit' },
    ];

    this.businessCategories = [
      { label: 'Retail', value: 'retail' },
      { label: 'E-commerce', value: 'ecommerce' },
      { label: 'Restaurant/Food Service', value: 'restaurant' },
      { label: 'Professional Services', value: 'professional_services' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Technology', value: 'technology' },
    ];

    this.countries = [
      { label: 'United States', value: 'US', code: 'US' },
      { label: 'Canada', value: 'CA', code: 'CA' },
      { label: 'United Kingdom', value: 'GB', code: 'GB' },
      { label: 'Germany', value: 'DE', code: 'DE' },
      { label: 'France', value: 'FR', code: 'FR' },
    ];

    this.isLoading = false;
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.activeIndex++;
    } else {
      this.markCurrentFormGroupTouched();
    }
  }

  previousStep() {
    this.activeIndex--;
  }

  isCurrentStepValid(): boolean {
    switch (this.activeIndex) {
      case 0:
        return this.businessInfoForm.valid;
      case 1:
        return this.addressForm.valid;
      case 2:
        return this.contactForm.valid;
      case 3:
        return this.bankingForm.valid;
      case 4:
        return this.documentsForm.valid;
      case 5:
        return this.agreementsForm.valid;
      default:
        return false;
    }
  }

  private markCurrentFormGroupTouched() {
    switch (this.activeIndex) {
      case 0:
        this.markFormGroupTouched(this.businessInfoForm);
        break;
      case 1:
        this.markFormGroupTouched(this.addressForm);
        break;
      case 2:
        this.markFormGroupTouched(this.contactForm);
        break;
      case 3:
        this.markFormGroupTouched(this.bankingForm);
        break;
      case 4:
        this.markFormGroupTouched(this.documentsForm);
        break;
      case 5:
        this.markFormGroupTouched(this.agreementsForm);
        break;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onFileSelect(event: any, documentType: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFiles[documentType] = file;
      this.documentsForm.patchValue({ [documentType]: file.name });
    }
  }

  onFileRemove(documentType: string) {
    delete this.uploadedFiles[documentType];
    this.documentsForm.patchValue({ [documentType]: '' });
  }

  submitForm() {
    if (!this.isAllFormsValid()) {
      return;
    }

    this.isSubmitting = true;

    const formData: MerchantOnboardingData = {
      businessName: this.businessInfoForm.get('businessName')?.value,
      businessType: this.businessInfoForm.get('businessType')?.value,
      businessCategory: this.businessInfoForm.get('businessCategory')?.value,
      registrationNumber: this.businessInfoForm.get('registrationNumber')?.value,
      taxId: this.businessInfoForm.get('taxId')?.value,
      yearEstablished: this.businessInfoForm.get('yearEstablished')?.value,
      numberOfEmployees: this.businessInfoForm.get('numberOfEmployees')?.value,
      website: this.businessInfoForm.get('website')?.value,
      description: this.businessInfoForm.get('description')?.value,
      businessAddress: {
        street: this.addressForm.get('street')?.value,
        city: this.addressForm.get('city')?.value,
        state: this.addressForm.get('state')?.value,
        postalCode: this.addressForm.get('postalCode')?.value,
        country: this.addressForm.get('country')?.value,
      },
      contactPerson: {
        firstName: this.contactForm.get('firstName')?.value,
        lastName: this.contactForm.get('lastName')?.value,
        position: this.contactForm.get('position')?.value,
        email: this.contactForm.get('email')?.value,
        phone: this.contactForm.get('phone')?.value,
        alternatePhone: this.contactForm.get('alternatePhone')?.value,
      },
      bankingDetails: {
        bankName: this.bankingForm.get('bankName')?.value,
        accountNumber: this.bankingForm.get('accountNumber')?.value,
        routingNumber: this.bankingForm.get('routingNumber')?.value,
        accountType: this.bankingForm.get('accountType')?.value,
        accountHolderName: this.bankingForm.get('accountHolderName')?.value,
      },
      documents: {
        businessLicense: this.uploadedFiles['businessLicense'],
        taxCertificate: this.uploadedFiles['taxCertificate'],
        bankStatement: this.uploadedFiles['bankStatement'],
        identityDocument: this.uploadedFiles['identityDocument'],
      },
      agreements: {
        termsAccepted: this.agreementsForm.get('termsAccepted')?.value,
        privacyPolicyAccepted: this.agreementsForm.get('privacyPolicyAccepted')?.value,
        processingAgreementAccepted: this.agreementsForm.get('processingAgreementAccepted')?.value,
        marketingConsent: this.agreementsForm.get('marketingConsent')?.value,
      },
    };

    // Mock successful submission for now
    setTimeout(() => {
      this.isSubmitting = false;
      this.merchantId = 'MERCH_' + Date.now();
      this.showSuccessDialog = true;
    }, 2000);
  }

  private isAllFormsValid(): boolean {
    return (
      this.businessInfoForm.valid &&
      this.addressForm.valid &&
      this.contactForm.valid &&
      this.bankingForm.valid &&
      this.documentsForm.valid &&
      this.agreementsForm.valid
    );
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['minlength'])
        return `Minimum length is ${field.errors['minlength'].requiredLength}`;
      if (field.errors['maxlength'])
        return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) return 'Please enter a valid format';
      if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
      if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;
    }
    return '';
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  closeSuccessDialog() {
    this.showSuccessDialog = false;
    this.resetForm();
  }

  private resetForm() {
    this.businessInfoForm.reset();
    this.addressForm.reset();
    this.contactForm.reset();
    this.bankingForm.reset();
    this.documentsForm.reset();
    this.agreementsForm.reset();
    this.uploadedFiles = {};
    this.activeIndex = 0;
  }
}
