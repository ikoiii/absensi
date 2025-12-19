/**
 * Constants and Configuration
 * 
 * Centralized constants used throughout the application
 */

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Session Status
 */
export const SESSION_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
} as const;

/**
 * Route Paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_SESSIONS: '/admin/sessions',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_REPORTS: '/admin/reports',
  STUDENT_DASHBOARD: '/student',
  STUDENT_SCAN: '/student/scan',
  STUDENT_HISTORY: '/student/history',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to access this resource',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_NOT_FOUND: 'Session not found',
  SESSION_INACTIVE: 'This session is no longer active',
  ALREADY_SCANNED: 'You have already scanned this session',
  SCAN_FAILED: 'Failed to record attendance. Please try again',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  REGISTER_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Successfully logged out',
  SESSION_CREATED: 'Session created successfully',
  ATTENDANCE_RECORDED: 'Attendance recorded successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;
