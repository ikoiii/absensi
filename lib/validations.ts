import { z } from 'zod';

/**
 * Validation schemas using Zod
 * Used for form validation in authentication and other features
 */

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
    nim: z.string().optional(),
    role: z.enum(['admin', 'student']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      // NIM required for students
      if (data.role === 'student') {
        return data.nim && data.nim.length > 0;
      }
      return true;
    },
    {
      message: 'NIM wajib diisi untuk mahasiswa',
      path: ['nim'],
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// SESSION SCHEMAS
// ============================================================================

/**
 * Create session form validation
 */
export const createSessionSchema = z.object({
  course_name: z.string().min(3, 'Nama mata kuliah minimal 3 karakter'),
  description: z.string().optional(),
});

export type CreateSessionFormData = z.infer<typeof createSessionSchema>;

// ============================================================================
// STUDENT SCHEMAS
// ============================================================================

/**
 * Create/Edit student form validation
 */
export const studentSchema = z.object({
  full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  nim: z.string().min(1, 'NIM wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

// ============================================================================
// PROFILE SCHEMAS
// ============================================================================

/**
 * Update profile validation
 */
export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  nim: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
