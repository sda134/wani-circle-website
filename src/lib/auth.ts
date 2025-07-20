export class AuthService {
  private static readonly SESSION_KEY = 'admin_session';

  static validatePassword(password: string): boolean {
    // In client-side, we'll validate against the environment
    if (typeof window !== 'undefined') {
      return password === window.__ADMIN_PASSWORD__;
    }
    return false;
  }

  static setSession(config?: any): void {
    if (typeof window !== 'undefined') {
      const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
        github_token: config?.GITHUB_TOKEN || window.__GITHUB_TOKEN__ || '',
        github_owner: config?.GITHUB_REPO_OWNER || window.__GITHUB_REPO_OWNER__ || '',
        github_repo: config?.GITHUB_REPO_NAME || window.__GITHUB_REPO_NAME__ || '',
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;

      const parsed = JSON.parse(sessionData);
      
      // Session expires after 8 hours
      const EIGHT_HOURS = 8 * 60 * 60 * 1000;
      const isValid = parsed.authenticated && 
                     parsed.timestamp && 
                     (Date.now() - parsed.timestamp) < EIGHT_HOURS;

      if (!isValid) {
        this.clearSession();
      }

      return isValid;
    } catch {
      this.clearSession();
      return false;
    }
  }

  static clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  static requireAuth(): void {
    if (!this.isAuthenticated()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
    }
  }
}