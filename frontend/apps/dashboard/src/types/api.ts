/**
 * API Type Definitions
 * 
 * TypeScript interfaces matching backend DTOs
 * Ensures type safety across API calls
 */

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string; // Optional for API, required in form
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserDto {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantName: string;
}

// ============================================================================
// ENUM TYPES (matching backend)
// ============================================================================

export enum UserRole {
  Admin = 'Admin',
  Agent = 'Agent',
  Viewer = 'Viewer',
}

export enum TenantStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Inactive = 'Inactive',
}

export enum SubscriptionPlan {
  Free = 'Free',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
}

export enum ConversationStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum DomainStatus {
  Pending = 'Pending',
  Active = 'Active',
  Inactive = 'Inactive',
  Failed = 'Failed',
}

export enum MessageRole {
  User = 'User',
  Assistant = 'Assistant',
  System = 'System',
}

export enum DocumentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
}

// ============================================================================
// DOMAIN TYPES
// ============================================================================

export interface DomainDto {
  id: string;
  tenantId: string;
  domainUrl: string;
  status: DomainStatus;
  createdAt: string;
  lastCrawledAt?: string;
}

export interface CreateDomainRequest {
  domainUrl: string;
}

export interface UpdateDomainRequest {
  status?: DomainStatus;
}

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

export interface ConversationDto {
  id: string;
  tenantId: string;
  domainId?: string;
  status: ConversationStatus;
  startedAt: string;
  endedAt?: string;
  customerEmail?: string;
  messageCount: number;
}

export interface ConversationDetailDto extends ConversationDto {
  messages: MessageDto[];
}

export interface CreateConversationRequest {
  domainId?: string;
  customerEmail?: string;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface MessageDto {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface SendMessageRequest {
  content: string;
  role?: MessageRole;
  metadata?: Record<string, any>;
}

// ============================================================================
// DOCUMENT TYPES
// ============================================================================

export interface DocumentDto {
  id: string;
  tenantId: string;
  domainId?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  uploadedAt: string;
  processedAt?: string;
  chunkCount: number;
}

export interface UploadDocumentRequest {
  file: File;
  domainId?: string;
}

export interface DocumentChunkDto {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  tokenCount: number;
}

// ============================================================================
// TENANT TYPES
// ============================================================================

export interface TenantDto {
  id: string;
  name: string;
  status: TenantStatus;
  plan: SubscriptionPlan;
  createdAt: string;
  userCount: number;
  domainCount: number;
  conversationCount: number;
}

export interface UpdateTenantRequest {
  name?: string;
  plan?: SubscriptionPlan;
  status?: TenantStatus;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  title: string;
  detail: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface IdResponse {
  id: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

