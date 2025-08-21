export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  firstName: string;
  lastName: string;
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
  permissions: string[];
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  user: AdminUser;
  message?: string;
}

export interface MerchantApplication {
  id: string;
  referenceNumber: string;
  businessName: string;
  businessType: string;
  businessCategory: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: Date;
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  estimatedRevenue: number;
  documents: {
    businessLicense: boolean;
    taxCertificate: boolean;
    bankStatement: boolean;
    identityDocument: boolean;
  };
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}
