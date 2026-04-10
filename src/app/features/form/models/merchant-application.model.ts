export type MerchantApplicationStatus = "pending" | "approved" | "rejected" | "called" | "under_review"

export interface PaymentMode {
  cash: boolean
  eWallets: boolean
  qrph: boolean
  cardPayment: boolean
}

export interface MerchantApplication {
  reference?: string
  contactPersonName: string
  registeredBy: string
  registeredByContactNumber: string
  contactNumber: string
  contactPerson: string
  businessName: string
  businessEmail: string
  businessAddress: string
  telephoneNo?: string
  hasExistingPaymentPortal: string
  currentModeOfPayment: PaymentMode
  estimatedTransactionNumbers?: string
  estimatedAverageAmount?: string
  status: MerchantApplicationStatus
  submittedAt: string
  createdAt?: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export interface BackendMerchantApplication {
  id: string
  reference: string
  contactPersonName: string
  registeredBy: string
  registeredByContactNumber: string
  contactNumber: string
  contactPerson: string
  businessName: string
  businessEmail: string
  businessAddress: string
  telephoneNo?: string
  hasExistingPaymentPortal?: string
  currentModeOfPayment?: PaymentMode | string
  estimatedTransactionNumbers?: string
  estimatedAverageAmount?: string
  status: string
  submitted_at: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  reference_id?: string
  reference?: string
}

export type MerchantApplicationPayload = Omit<MerchantApplication, "status" | "submittedAt">
