import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MerchantOnboardingComponent } from './merchant-form.component';
import { FormService } from '../../services/form.service';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';

describe('MerchantOnboardingComponent', () => {
  let component: MerchantOnboardingComponent;
  let fixture: ComponentFixture<MerchantOnboardingComponent>;
  let mockFormService: jasmine.SpyObj<FormService>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  // Create proper mock forms that match the actual FormService structure
  const createMockForm = (): FormGroup => {
    return new FormGroup({
      businessName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      businessType: new FormControl('', [Validators.required]),
      businessCategory: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl(''),
      yearEstablished: new FormControl('', [Validators.required, Validators.min(1800), Validators.max(new Date().getFullYear())]),
      numberOfEmployees: new FormControl('', [Validators.required]),
      website: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)])
    });
  };

  const createMockContactForm = (): FormGroup => {
    return new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      position: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]),
      alternatePhone: new FormControl('', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]),
      street: new FormControl('', [Validators.required, Validators.minLength(5)]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)]),
      state: new FormControl('', [Validators.required, Validators.minLength(2)]),
      postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]),
      country: new FormControl('', [Validators.required])
    });
  };

  beforeEach(async () => {
    const formServiceSpy = jasmine.createSpyObj('FormService', [
      'createBusinessInfoForm', 
      'createContactForm', 
      'markFormGroupTouched'
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getBusinessTypes', 
      'getBusinessCategories', 
      'getCountries',
      'submitMerchantApplication'
    ]);

    // Mock form creation with proper FormGroup instances
    formServiceSpy.createBusinessInfoForm.and.returnValue(createMockForm());
    formServiceSpy.createContactForm.and.returnValue(createMockContactForm());

    // Mock API responses
    apiServiceSpy.getBusinessTypes.and.returnValue(of([
      { label: "Sole Proprietorship", value: "sole_prop" },
      { label: "Partnership", value: "partnership" }
    ]));
    apiServiceSpy.getBusinessCategories.and.returnValue(of([
      { label: 'Retail', value: 'retail' },
      { label: 'E-commerce', value: 'ecommerce' }
    ]));
    apiServiceSpy.getCountries.and.returnValue(of([
      { label: 'United States', value: 'US', code: 'US' },
      { label: 'Canada', value: 'CA', code: 'CA' }
    ]));

    await TestBed.configureTestingModule({
      imports: [MerchantOnboardingComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: FormService, useValue: formServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantOnboardingComponent);
    component = fixture.componentInstance;
    mockFormService = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.activeIndex()).toBe(0);
    expect(component.steps().length).toBe(4);
    expect(component.isLoading()).toBe(false);
    expect(component.isSubmitting()).toBe(false);
    expect(component.showSuccessDialog()).toBe(false);
  });

  it('should initialize all forms', () => {
    expect(component.businessInfoForm).toBeDefined();
    expect(component.contactForm).toBeDefined();
  });

  it('should load dropdown data on init', () => {
    expect(component.businessTypes().length).toBeGreaterThan(0);
    expect(component.businessCategories().length).toBeGreaterThan(0);
    expect(component.countries().length).toBeGreaterThan(0);
  });

  describe('Form Validation', () => {
    it('should validate business info form', () => {
      const form = component.businessInfoForm;
      expect(form.valid).toBeFalsy();
      
      // Fill form with valid data
      form.patchValue({
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        yearEstablished: 2020,
        numberOfEmployees: '1-5',
        description: 'A test business description that meets the minimum length requirement'
      });
      
      expect(form.valid).toBeTruthy();
    });

    it('should validate contact form', () => {
      const form = component.contactForm;
      expect(form.valid).toBeFalsy();
      
      // Fill form with valid data
      form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        position: 'Manager',
        email: 'john.doe@test.com',
        phone: '+1-555-123-4567',
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      });
      
      expect(form.valid).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should not advance to next step if current step is invalid', () => {
      const initialIndex = component.activeIndex();
      component.nextStep();
      expect(component.activeIndex()).toBe(initialIndex);
    });

    it('should advance to next step if current step is valid', () => {
      // Fill business info form with valid data
      component.businessInfoForm.patchValue({
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        yearEstablished: 2020,
        numberOfEmployees: '1-5',
        description: 'A test business description that meets the minimum length requirement'
      });
      
      const initialIndex = component.activeIndex();
      component.nextStep();
      expect(component.activeIndex()).toBe(initialIndex + 1);
    });

    it('should go to previous step', () => {
      component.activeIndex.set(1);
      component.previousStep();
      expect(component.activeIndex()).toBe(0);
    });
  });

  describe('File Handling', () => {
    it('should handle file selection', () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const mockEvent = { file: mockFile, type: 'businessLicense' };
      
      component.onFileSelect(mockEvent);
      
      expect(component.uploadedFiles()['businessLicense']).toBe(mockFile);
    });

    it('should handle file removal', () => {
      component.uploadedFiles.set({ businessLicense: new File(['test'], 'test.pdf', { type: 'application/pdf' }) });
      
      component.onFileRemove('businessLicense');
      
      expect(component.uploadedFiles()['businessLicense']).toBeUndefined();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if forms are invalid', () => {
      component.submitForm();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should validate all forms before submission', () => {
      // Fill business info form with valid data
      component.businessInfoForm.patchValue({
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        yearEstablished: 2020,
        numberOfEmployees: '1-5',
        description: 'A test business description that meets the minimum length requirement'
      });
      
      // Fill contact form with valid data
      component.contactForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        position: 'Manager',
        email: 'john.doe@test.com',
        phone: '+1-555-123-4567',
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      });
      
      expect(component.businessInfoForm.valid).toBeTruthy();
      expect(component.contactForm.valid).toBeTruthy();
    });

    it('should submit form successfully', () => {
      // Fill business info form with valid data
      component.businessInfoForm.patchValue({
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        yearEstablished: 2020,
        numberOfEmployees: '1-5',
        description: 'A test business description that meets the minimum length requirement'
      });
      
      // Fill contact form with valid data
      component.contactForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        position: 'Manager',
        email: 'john.doe@test.com',
        phone: '+1-555-123-4567',
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      });
      
      // Mock API response
      mockApiService.submitMerchantApplication.and.returnValue(of({
        merchantId: 'MERCH_123',
        status: 'pending'
      }));
      
      component.submitForm();
      
      expect(mockApiService.submitMerchantApplication).toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset all forms and reset to first step', () => {
      component.activeIndex.set(3);
      
      component.closeSuccessDialog();
      
      expect(component.activeIndex()).toBe(0);
      expect(component.uploadedFiles()).toEqual({});
    });
  });

  describe('API Integration', () => {
    it('should load business types from API', () => {
      expect(mockApiService.getBusinessTypes).toHaveBeenCalled();
    });

    it('should load business categories from API', () => {
      expect(mockApiService.getBusinessCategories).toHaveBeenCalled();
    });

    it('should load countries from API', () => {
      expect(mockApiService.getCountries).toHaveBeenCalled();
    });
  });
});
