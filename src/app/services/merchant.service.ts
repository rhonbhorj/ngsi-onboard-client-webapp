import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  MerchantOnboardingData,
  BusinessType,
  BusinessCategory,
  Country,
} from '../models/merchant.component';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  private apiUrl = 'https://api.netpay.com'; // Replace with actual API endpoint

  constructor(private http: HttpClient) {}

  // Submit merchant onboarding data
  submitMerchantOnboarding(data: MerchantOnboardingData): Observable<any> {
    const formData = new FormData();

    // Add basic merchant data
    formData.append(
      'merchantData',
      JSON.stringify({
        businessName: data.businessName,
        businessType: data.businessType,
        businessCategory: data.businessCategory,
        registrationNumber: data.registrationNumber,
        taxId: data.taxId,
        yearEstablished: data.yearEstablished,
        numberOfEmployees: data.numberOfEmployees,
        website: data.website,
        description: data.description,
        businessAddress: data.businessAddress,
        contactPerson: data.contactPerson,
        bankingDetails: data.bankingDetails,
        agreements: data.agreements,
      })
    );

    // Add documents
    if (data.documents.businessLicense) {
      formData.append('businessLicense', data.documents.businessLicense);
    }
    if (data.documents.taxCertificate) {
      formData.append('taxCertificate', data.documents.taxCertificate);
    }
    if (data.documents.bankStatement) {
      formData.append('bankStatement', data.documents.bankStatement);
    }
    if (data.documents.identityDocument) {
      formData.append('identityDocument', data.documents.identityDocument);
    }
    if (data.documents.additionalDocuments) {
      data.documents.additionalDocuments.forEach((doc: File, index: number) => {
        formData.append(`additionalDocument_${index}`, doc);
      });
    }

    // For demo purposes, return a success response
    // In production, use: return this.http.post(`${this.apiUrl}/merchants/onboard`, formData);
    return of({
      success: true,
      message: 'Merchant onboarding submitted successfully',
      merchantId: 'MERCH_' + Date.now(),
    });
  }

  // Get business types
  getBusinessTypes(): Observable<BusinessType[]> {
    return of([
      { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
      { label: 'Partnership', value: 'partnership' },
      { label: 'Limited Liability Company (LLC)', value: 'llc' },
      { label: 'Corporation', value: 'corporation' },
      { label: 'Non-Profit Organization', value: 'non_profit' },
      { label: 'Government Entity', value: 'government' },
    ]);
  }

  // Get business categories
  getBusinessCategories(): Observable<BusinessCategory[]> {
    return of([
      { label: 'Retail', value: 'retail' },
      { label: 'E-commerce', value: 'ecommerce' },
      { label: 'Restaurant/Food Service', value: 'restaurant' },
      { label: 'Professional Services', value: 'professional_services' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Education', value: 'education' },
      { label: 'Technology', value: 'technology' },
      { label: 'Manufacturing', value: 'manufacturing' },
      { label: 'Construction', value: 'construction' },
      { label: 'Transportation', value: 'transportation' },
      { label: 'Hospitality', value: 'hospitality' },
      { label: 'Financial Services', value: 'financial_services' },
      { label: 'Real Estate', value: 'real_estate' },
      { label: 'Entertainment', value: 'entertainment' },
      { label: 'Other', value: 'other' },
    ]);
  }

  // Get countries
  getCountries(): Observable<Country[]> {
    return of([
      { label: 'United States', value: 'US', code: 'US' },
      { label: 'Canada', value: 'CA', code: 'CA' },
      { label: 'United Kingdom', value: 'GB', code: 'GB' },
      { label: 'Australia', value: 'AU', code: 'AU' },
      { label: 'Germany', value: 'DE', code: 'DE' },
      { label: 'France', value: 'FR', code: 'FR' },
      { label: 'Japan', value: 'JP', code: 'JP' },
      { label: 'Singapore', value: 'SG', code: 'SG' },
      { label: 'Netherlands', value: 'NL', code: 'NL' },
      { label: 'Sweden', value: 'SE', code: 'SE' },
    ]);
  }

  // Validate business registration number
  validateRegistrationNumber(registrationNumber: string, country: string): Observable<boolean> {
    // In production, this would call an actual validation API
    return of(registrationNumber.length >= 6);
  }

  // Validate tax ID
  validateTaxId(taxId: string, country: string): Observable<boolean> {
    // In production, this would call an actual validation API
    return of(taxId.length >= 9);
  }
}
