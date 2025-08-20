export interface MerchantOnboardingData {
  // Business Information
  businessName: string;
  businessType: string;
  businessCategory: string;
  registrationNumber: string;
  taxId: string;
  yearEstablished: number;
  numberOfEmployees: string;
  website?: string;
  description: string;

  // Business Address
  businessAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  // Contact Information
  contactPerson: {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
    alternatePhone?: string;
  };

  // Banking Information
  bankingDetails: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    accountHolderName: string;
  };

  // Business Documents
  documents: {
    businessLicense?: File;
    taxCertificate?: File;
    bankStatement?: File;
    identityDocument?: File;
    additionalDocuments?: File[];
  };

  // Terms and Agreements
  agreements: {
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
    processingAgreementAccepted: boolean;
    marketingConsent: boolean;
  };
}

export interface FormStep {
  label: string;
  completed: boolean;
  valid: boolean;
}

export interface BusinessType {
  label: string;
  value: string;
}

export interface BusinessCategory {
  label: string;
  value: string;
}

export interface Country {
  label: string;
  value: string;
  code: string;
}
