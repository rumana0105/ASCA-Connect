import { User, UserRole } from '../types';

/**
 * ASCA DEMO AUTHENTICATION CONFIGURATION
 * 
 * In this project phase, the platform operates in DEMO AUTHENTICATION MODE.
 * This allows full academic demonstration and evaluation of the ASCA algorithm
 * and multi-role workflows without requiring an active MongoDB connection.
 * 
 * All demo credentials are configured below and are verified against
 * these accounts on login.
 */

export const DEMO_MODE = true;

export interface DemoAccount {
  username: string;
  password: string;
  role: UserRole;
  user: User;
}

export const DEMO_ACCOUNTS: Record<UserRole, DemoAccount> = {
  donor: {
    username: 'rumana.donor',
    password: 'Rumana@123',
    role: 'donor',
    user: {
      id: 'user-donor-rumana',
      name: 'Rumana',
      email: 'rumana.donor@asca.demo',
      role: 'donor',
      phone: '+1 (555) 342-8921',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T10:00:00Z'
    }
  },
  ngo: {
    username: 'richa.ngo',
    password: 'Richa@123',
    role: 'ngo',
    user: {
      id: 'user-ngo-richa',
      name: 'Richa',
      email: 'richa.ngo@asca.demo',
      role: 'ngo',
      organizationName: 'Richa Community Welfare Centre',
      ngoId: 'ngo-richa-welfare',
      phone: '+1 (555) 789-4321',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-07-20T09:00:00Z'
    }
  },
  admin: {
    username: 'asca.admin',
    password: 'ASCA@2026',
    role: 'admin',
    user: {
      id: 'user-admin-asca',
      name: 'ASCA Project Admin',
      email: 'asca.admin@asca.demo',
      role: 'admin',
      organizationName: 'ASCA Research Consortium',
      phone: '+1 (555) 900-2026',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-06-01T08:00:00Z'
    }
  },
  guest: {
    username: '',
    password: '',
    role: 'guest',
    user: {
      id: 'user-guest',
      name: 'Public Visitor',
      email: 'guest@asca.demo',
      role: 'guest',
      createdAt: new Date().toISOString()
    }
  }
};

/**
 * Validates demo credentials for a given role.
 * Returns the authenticated User if credentials match, or throws/returns error.
 */
export function verifyDemoCredentials(
  role: UserRole,
  usernameInput: string,
  passwordInput: string
): { success: boolean; user?: User; error?: string } {
  const normalizedUsername = usernameInput.trim().toLowerCase();
  const trimmedPassword = passwordInput.trim();

  const account = DEMO_ACCOUNTS[role];
  if (!account || role === 'guest') {
    return { success: false, error: 'Invalid user role selected.' };
  }

  if (
    normalizedUsername === account.username.toLowerCase() &&
    trimmedPassword === account.password
  ) {
    return { success: true, user: account.user };
  }

  return { success: false, error: 'Invalid username or password.' };
}
