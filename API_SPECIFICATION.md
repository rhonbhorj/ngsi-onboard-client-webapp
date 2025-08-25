# Merchant Onboarding API Specification

## Overview

This document outlines the API endpoints needed for the merchant onboarding system. The frontend will send form data via HTTP requests to these endpoints.

## Base URL

```
http://localhost:8000/api
```

## Endpoints

### 1. Submit Merchant Application

**POST** `/api/merchant-applications`

#### Request Body (JSON)

```json
{
  "contactPersonName": "string (required)",
  "contactNumber": "string (required)",
  "businessName": "string (required)",
  "businessEmail": "string (required, email format)",
  "businessAddress": "string (required)",
  "industryOrBusinessStyle": "string (required)",
  "telephoneNo": "string (optional)",
  "typeOfBusiness": "string (required) - one of: 'Sole Proprietorship', 'Partnership', 'Corporation', 'Others'",
  "hasExistingPaymentPortal": "string (required) - 'YES' or 'NO'",
  "currentModeOfPayment": {
    "cash": "boolean (required)",
    "eWallets": "boolean (required)",
    "qrph": "boolean (required)",
    "cardPayment": "boolean (required)"
  },
  "estimatedTransactionNumbers": "string (optional) - e.g., '51 – 100', 'ABOVE 100'",
  "estimatedAverageAmount": "string (optional) - e.g., '10,001 – 50,000', 'ABOVE 50,000'"
}
```

#### Sample Request

```json
{
  "contactPersonName": "Ritchmond Tajarros",
  "contactNumber": "09177589353",
  "businessName": "NetGlobal Solutions Inc",
  "businessEmail": "tajarrosrj@gmail.com",
  "businessAddress": "123 Business Street, Metro Manila, Philippines",
  "industryOrBusinessStyle": "Technology Solutions",
  "telephoneNo": "02-1234-5678",
  "typeOfBusiness": "Corporation",
  "hasExistingPaymentPortal": "NO",
  "currentModeOfPayment": {
    "cash": false,
    "eWallets": true,
    "qrph": false,
    "cardPayment": true
  },
  "estimatedTransactionNumbers": "51 – 100",
  "estimatedAverageAmount": "10,001 – 50,000"
}
```

#### Response (Success - 201 Created)

```json
{
  "id": "app_001",
  "reference": "ngsi-25-00001",
  "contactPersonName": "Ritchmond Tajarros",
  "contactNumber": "09177589353",
  "businessName": "NetGlobal Solutions Inc",
  "businessEmail": "tajarrosrj@gmail.com",
  "businessAddress": "123 Business Street, Metro Manila, Philippines",
  "industryOrBusinessStyle": "Technology Solutions",
  "telephoneNo": "02-1234-5678",
  "typeOfBusiness": "Corporation",
  "hasExistingPaymentPortal": "NO",
  "currentModeOfPayment": {
    "cash": false,
    "eWallets": true,
    "qrph": false,
    "cardPayment": true
  },
  "estimatedTransactionNumbers": "51 – 100",
  "estimatedAverageAmount": "10,001 – 50,000",
  "status": "pending",
  "submittedAt": "2025-01-27T10:30:00Z"
}
```

### 2. Get All Applications

**GET** `/api/merchant-applications`

#### Response

```json
[
  {
    "id": "app_001",
    "reference": "ngsi-25-00001",
    "contactPersonName": "Ritchmond Tajarros",
    "businessName": "NetGlobal Solutions Inc",
    "businessEmail": "tajarrosrj@gmail.com",
    "status": "pending",
    "submittedAt": "2025-01-27T10:30:00Z"
  }
]
```

### 3. Get Applications by Status

**GET** `/api/merchant-applications?status={status}`

#### Query Parameters

- `status`: pending, approved, rejected, under_review

#### Response

```json
[
  {
    "id": "app_001",
    "reference": "ngsi-25-00002",
    "contactPersonName": "Ritchmond Tajarros",
    "businessName": "NetGlobal Solutions Inc",
    "status": "pending",
    "submittedAt": "2025-01-27T10:30:00Z"
  }
]
```

### 4. Update Application Status

**PATCH** `/api/merchant-applications/{id}`

#### Request Body

```json
{
  "status": "approved",
  "notes": "Application approved after review"
}
```

#### Response

```json
{
  "id": "app_001",
  "reference": "ngsi-25-00001",
  "status": "approved",
  "notes": "Application approved after review",
  "reviewedAt": "2025-01-27T15:30:00Z",
  "reviewedBy": "admin_001"
}
```

## Database Schema

### Table: `merchant_applications`

```sql
CREATE TABLE merchant_applications (
  id VARCHAR(50) PRIMARY KEY,
  reference VARCHAR(20) NOT NULL UNIQUE,
  contact_person_name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  business_address TEXT NOT NULL,
  industry_or_business_style VARCHAR(255) NOT NULL,
  telephone_no VARCHAR(20),
  type_of_business ENUM('Sole Proprietorship', 'Partnership', 'Corporation', 'Others') NOT NULL,
  has_existing_payment_portal ENUM('YES', 'NO') NOT NULL,
  current_mode_of_payment JSON NOT NULL,
  estimated_transaction_numbers VARCHAR(100),
  estimated_average_amount VARCHAR(100),
  status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by VARCHAR(100),
  notes TEXT
);
```

## Validation Rules

### Required Fields

- `contactPersonName`: Minimum 2 characters
- `contactNumber`: Philippine mobile format (09XXXXXXXXX)
- `businessName`: Minimum 2 characters
- `businessEmail`: Valid email format
- `businessAddress`: Minimum 10 characters
- `industryOrBusinessStyle`: Minimum 2 characters
- `typeOfBusiness`: Must be one of the specified values
- `hasExistingPaymentPortal`: Must be 'YES' or 'NO'
- `currentModeOfPayment`: All boolean fields required

### Optional Fields

- `telephoneNo`: Landline number
- `estimatedTransactionNumbers`: Transaction volume estimate
- `estimatedAverageAmount`: Average transaction amount estimate

## Error Responses

### Validation Error (400 Bad Request)

```json
{
  "error": "Validation failed",
  "details": {
    "businessEmail": "Invalid email format",
    "contactNumber": "Must be valid Philippine mobile number"
  }
}
```

### Not Found (404)

```json
{
  "error": "Application not found"
}
```

### Server Error (500)

```json
{
  "error": "Internal server error"
}
```

## Notes for Backend Developer

1. **Phone Number Validation**: Implement Philippine mobile number format validation (09XXXXXXXXX)
2. **Email Validation**: Use standard email validation
3. **Status Management**: Applications start with 'pending' status
4. **Auto-generation**: Generate unique ID for each application and a human-readable `reference`
   - Format: `ngsi-YY-XXXXX` (e.g., `ngsi-25-00001`)
   - `YY` = last two digits of current year
   - `XXXXX` = zero-padded incremental sequence per year
   - Ensure uniqueness with a transaction/lock
   - Set on create and return in all responses
5. **Timestamps**: Use ISO 8601 format for dates
6. **JSON Storage**: Store `currentModeOfPayment` as JSON in database
7. **CORS**: Enable CORS for frontend domain
8. **Rate Limiting**: Consider implementing rate limiting for form submissions

## Testing

Test the endpoints with the sample data provided above. Ensure all validation rules work correctly and proper error messages are returned.

## Some Additional Q&A

1. What database system are you using?
2. Do you need additional fields in the database?
3. Any specific validation rules for business names or addresses?
4. How do you want to handle file uploads (if any)?
5. Any authentication/authorization requirements?
6. Preferred response format for errors?
