/** Standardized API success response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/** Standardized API error response */
export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

/** Auth login/register response shape */
export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    avatar: string;
    createdAt: Date;
  };
}

/** Serialized lead for API responses */
export interface LeadResponse {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: string;
  value: number;
  source: string;
  description?: string;
  notes: NoteResponse[];
  createdAt: Date;
  updatedAt: Date;
}

/** Serialized note for API responses */
export interface NoteResponse {
  id: string;
  leadId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}
