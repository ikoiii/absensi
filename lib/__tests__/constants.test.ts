import { describe, it, expect } from '@jest/globals';
import { USER_ROLES, ROUTES } from '../constants';

describe('Constants', () => {
  describe('USER_ROLES', () => {
    it('should have admin role', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
    });

    it('should have student role', () => {
      expect(USER_ROLES.STUDENT).toBe('student');
    });

    it('should only have two roles', () => {
      const roles = Object.values(USER_ROLES);
      expect(roles).toHaveLength(2);
    });
  });

  describe('ROUTES', () => {
    it('should have all required routes', () => {
      expect(ROUTES.HOME).toBeDefined();
      expect(ROUTES.LOGIN).toBeDefined();
      expect(ROUTES.REGISTER).toBeDefined();
      expect(ROUTES.ADMIN_DASHBOARD).toBeDefined();
      expect(ROUTES.STUDENT_DASHBOARD).toBeDefined();
    });

    it('should have correct route paths', () => {
      expect(ROUTES.LOGIN).toBe('/login');
      expect(ROUTES.REGISTER).toBe('/register');
      expect(ROUTES.ADMIN_DASHBOARD).toBe('/admin');
      expect(ROUTES.STUDENT_DASHBOARD).toBe('/student');
    });
  });
});
