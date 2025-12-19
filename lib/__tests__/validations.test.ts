import { describe, it, expect } from '@jest/globals';
import {
  loginSchema,
  registerSchema,
  createSessionSchema,
} from '../validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email tidak valid');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimal 6 karakter');
      }
    });

    it('should reject empty fields', () => {
      const invalidData = {
        email: '',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct admin registration', () => {
      const validData = {
        full_name: 'Test Admin',
        email: 'admin@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'admin' as const,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate correct student registration with NIM', () => {
      const validData = {
        full_name: 'Test Student',
        email: 'student@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student' as const,
        nim: '123456789',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject student registration without NIM', () => {
      const invalidData = {
        full_name: 'Test Student',
        email: 'student@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('NIM wajib diisi');
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different password',
        role: 'admin' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password tidak cocok');
      }
    });

    it('should reject short name', () => {
      const invalidData = {
        full_name: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'admin' as const,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createSessionSchema', () => {
    it('should validate correct session data', () => {
      const validData = {
        course_name: 'Data Structures 101',
      };

      const result = createSessionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty course name', () => {
      const invalidData = {
        course_name: '',
      };

      const result = createSessionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject too short course name', () => {
      const invalidData = {
        course_name: 'A',
      };

      const result = createSessionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept whitespace that gets preserved (current behavior)', () => {
      const dataWithSpaces = {
        course_name: '  Data Structures  ',
      };

      const result = createSessionSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      // Note: Current schema doesn't trim, that's OK for MVP
    });
  });
});
