import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MerchantService } from './merchant.service';
import {
  MerchantOnboardingData,
  BusinessType,
  BusinessCategory,
  Country,
} from '../models/merchant.component';

describe('MerchantService', () => {
  let service: MerchantService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MerchantService],
    });
    service = TestBed.inject(MerchantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('submitMerchantOnboarding', () => {
    it('should submit merchant onboarding data successfully', (done) => {
      const mockData: MerchantOnboardingData = {
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        registrationNumber: '123456789',
        taxId: '123456789',
        yearEstablished: 2020,
        businessAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345',
          country: 'US',
        },
        contactPerson: {
          firstName: 'John',
          lastName: 'Doe',
          position: 'Manager',
          email: 'john@test.com',
          phone: '+1-555-123-4567',
          alternatePhone: '',
        },
        bankingDetails: {
          bankName: 'Test Bank',
          accountNumber: '1234567890',
          routingNumber: '123456789',
          accountType: 'checking',
          accountHolderName: 'John Doe',
        },
        documents: {
          businessLicense: new File(['test'], 'license.pdf', { type: 'application/pdf' }),
          taxCertificate: new File(['test'], 'tax.pdf', { type: 'application/pdf' }),
          bankStatement: new File(['test'], 'bank.pdf', { type: 'application/pdf' }),
          identityDocument: new File(['test'], 'id.pdf', { type: 'application/pdf' }),
        },
        agreements: {
          termsAccepted: true,
          privacyPolicyAccepted: true,
          processingAgreementAccepted: true,
          marketingConsent: false,
        },
      };

      service.submitMerchantOnboarding(mockData).subscribe((result) => {
        expect(result.success).toBeTruthy();
        expect(result.message).toBe('Merchant onboarding submitted successfully');
        expect(result.merchantId).toMatch(/^MERCH_\d+$/);
        done();
      });
    });

    it('should handle onboarding data without documents', (done) => {
      const mockData: MerchantOnboardingData = {
        businessName: 'Test Business',
        businessType: 'llc',
        businessCategory: 'retail',
        registrationNumber: '123456789',
        taxId: '123456789',
        yearEstablished: 2020,
        businessAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345',
          country: 'US',
        },
        contactPerson: {
          firstName: 'John',
          lastName: 'Doe',
          position: 'Manager',
          email: 'john@test.com',
          phone: '+1-555-123-4567',
          alternatePhone: '',
        },
        bankingDetails: {
          bankName: 'Test Bank',
          accountNumber: '1234567890',
          routingNumber: '123456789',
          accountType: 'checking',
          accountHolderName: 'John Doe',
        },
        documents: {
          businessLicense: undefined,
          taxCertificate: undefined,
          bankStatement: undefined,
          identityDocument: undefined,
        },
        agreements: {
          termsAccepted: true,
          privacyPolicyAccepted: true,
          processingAgreementAccepted: true,
          marketingConsent: false,
        },
      };

      service.submitMerchantOnboarding(mockData).subscribe((result) => {
        expect(result.success).toBeTruthy();
        done();
      });
    });
  });

  describe('getBusinessTypes', () => {
    it('should return business types', (done) => {
      service.getBusinessTypes().subscribe((types) => {
        expect(types).toBeDefined();
        expect(types.length).toBeGreaterThan(0);
        expect(types[0].label).toBeDefined();
        expect(types[0].value).toBeDefined();
        done();
      });
    });

             it('should include specific business types', (done) => {
      service.getBusinessTypes().subscribe((types) => {
        const soleProprietorshipType = types.find((type) => type.value === 'sole_proprietorship');
        const llcType = types.find((type) => type.value === 'llc');
        
        expect(soleProprietorshipType).toBeDefined();
        expect(llcType).toBeDefined();
        done();
      });
    });
  });

  describe('getBusinessCategories', () => {
    it('should return business categories', (done) => {
      service.getBusinessCategories().subscribe((categories) => {
        expect(categories).toBeDefined();
        expect(categories.length).toBeGreaterThan(0);
        expect(categories[0].label).toBeDefined();
        expect(categories[0].value).toBeDefined();
        done();
      });
    });

    it('should include specific business categories', (done) => {
      service.getBusinessCategories().subscribe((categories) => {
        const retailCategory = categories.find((cat) => cat.value === 'retail');
        const techCategory = categories.find((cat) => cat.value === 'technology');
        
        expect(retailCategory).toBeDefined();
        expect(techCategory).toBeDefined();
        done();
      });
    });
  });

  describe('getCountries', () => {
    it('should return countries', (done) => {
      service.getCountries().subscribe((countries) => {
        expect(countries).toBeDefined();
        expect(countries.length).toBeGreaterThan(0);
        expect(countries[0].label).toBeDefined();
        expect(countries[0].value).toBeDefined();
        expect(countries[0].code).toBeDefined();
        done();
      });
    });

    it('should include specific countries', (done) => {
      service.getCountries().subscribe((countries) => {
        const usCountry = countries.find((country) => country.code === 'US');
        const caCountry = countries.find((country) => country.code === 'CA');
        
        expect(usCountry).toBeDefined();
        expect(caCountry).toBeDefined();
        expect(usCountry?.label).toBe('United States');
        expect(caCountry?.label).toBe('Canada');
        done();
      });
    });
  });

  describe('validateRegistrationNumber', () => {
    it('should validate registration number length', (done) => {
      service.validateRegistrationNumber('123456', 'US').subscribe((isValid) => {
        expect(isValid).toBeTruthy();
        done();
      });
    });

    it('should reject short registration numbers', (done) => {
      service.validateRegistrationNumber('12345', 'US').subscribe((isValid) => {
        expect(isValid).toBeFalsy();
        done();
      });
    });

    it('should handle different countries', (done) => {
      service.validateRegistrationNumber('123456789', 'CA').subscribe((isValid) => {
        expect(isValid).toBeTruthy();
        done();
      });
    });
  });

  describe('validateTaxId', () => {
    it('should validate tax ID length', (done) => {
      service.validateTaxId('123456789', 'US').subscribe((isValid) => {
        expect(isValid).toBeTruthy();
        done();
      });
    });

    it('should reject short tax IDs', (done) => {
      service.validateTaxId('12345678', 'US').subscribe((isValid) => {
        expect(isValid).toBeFalsy();
        done();
      });
    });

    it('should handle different countries', (done) => {
      service.validateTaxId('123456789012', 'CA').subscribe((isValid) => {
        expect(isValid).toBeTruthy();
        done();
      });
    });
  });
});
