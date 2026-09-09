import { User, UserRole } from '../types';
import { DEMO_MODE, DEMO_ACCOUNTS, verifyDemoCredentials } from '../config/demoAuth';

const SESSION_STORAGE_KEY = 'asca_auth_session';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

/**
 * Authentication Service
 * 
 * Handles login, session persistence, and logout.
 * Currently configured in DEMO MODE with hardcoded demo credentials.
 * 
 * Future MongoDB Integration:
 * Replace the verifyDemoCredentials call with an HTTP request to:
 * `POST /api/auth/login` (Express + MongoDB + bcrypt + JWT).
 */
export const authService = {
  /**
   * Performs authentication for the given role.
   */
  async login(role: UserRole, username: string, password: string): Promise<AuthResponse> {
    if (DEMO_MODE) {
      const verification = verifyDemoCredentials(role, username, password);
      if (verification.success && verification.user) {
        // Save session locally
        const sessionPayload = {
          user: verification.user,
          role: verification.user.role,
          token: `demo-jwt-token-${verification.user.role}-${Date.now()}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000
        };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
        return {
          success: true,
          user: verification.user,
          token: sessionPayload.token
        };
      }
      return {
        success: false,
        error: verification.error || 'Invalid username or password.'
      };
    }

    // Future MongoDB/Express API call:
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
        return { success: true, user: data.user, token: data.token };
      }
      return { success: false, error: data.message || 'Authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unable to connect to authentication service.' };
    }
  },

  /**
   * Retrieves active session from session storage.
   */
  getSession(): { user: User | null; token: string | null } {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { user: parsed.user, token: parsed.token };
      }
    } catch {
      // ignore
    }
    return { user: null, token: null };
  },

  /**
   * Clears session and logs out user.
   */
  logout(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('asca_current_user');
  },

  /**
   * Checks if a user is currently authenticated with a given role.
   */
  isAuthenticated(): boolean {
    const { user } = this.getSession();
    return !!user && user.role !== 'guest';
  },

  hasRole(expectedRole: UserRole): boolean {
    const { user } = this.getSession();
    return !!user && user.role === expectedRole;
  }
};
