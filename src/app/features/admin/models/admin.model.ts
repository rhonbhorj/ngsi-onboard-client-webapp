export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
}

export interface AdminLoginCredentials {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  user: AdminUser;
  token: string;
  message: string;
}

export interface AdminNotification {
  id: string;
  type: 'new_application' | 'status_change' | 'system_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
