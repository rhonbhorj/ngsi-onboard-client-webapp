// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface BusinessTypeResponse {
  id: number;
  label: string;
  value: string;
  description?: string;
}

export interface BusinessCategoryResponse {
  id: number;
  label: string;
  value: string;
  description?: string;
}

export interface CountryResponse {
  id: number;
  label: string;
  value: string;
  code: string;
  phoneCode?: string;
}

export interface MerchantSubmissionResponse {
  merchantId: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  message: string;
  estimatedReviewTime?: string;
}

export interface DocumentUploadResponse {
  documentId: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'verified' | 'rejected';
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: ValidationError[];
  timestamp?: string;
}
