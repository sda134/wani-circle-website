import { AuthService } from './auth';

export async function initializeAdmin(): Promise<boolean> {
  // Check if already authenticated
  if (!AuthService.isAuthenticated()) {
    window.location.href = '/admin';
    return false;
  }

  // Check if we already have config loaded in window
  if (window.__GITHUB_TOKEN__ && window.__GITHUB_REPO_OWNER__ && window.__GITHUB_REPO_NAME__) {
    return true;
  }

  // Try to restore config from localStorage
  try {
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) {
      AuthService.clearSession();
      window.location.href = '/admin';
      return false;
    }

    const session = JSON.parse(sessionData);
    
    // Restore config to window object
    if (session.github_token && session.github_owner && session.github_repo) {
      window.__GITHUB_TOKEN__ = session.github_token;
      window.__GITHUB_REPO_OWNER__ = session.github_owner;
      window.__GITHUB_REPO_NAME__ = session.github_repo;
      
      console.log('Restored config from localStorage:', {
        token: session.github_token ? `${session.github_token.substring(0, 10)}...` : 'Not set',
        owner: session.github_owner,
        repo: session.github_repo,
      });
      
      return true;
    } else {
      console.warn('Configuration not found in session. Please log in again.');
      AuthService.clearSession();
      window.location.href = '/admin';
      return false;
    }
    
  } catch (error) {
    console.error('Failed to initialize admin:', error);
    AuthService.clearSession();
    window.location.href = '/admin';
    return false;
  }
}

export function requireAdminConfig(): boolean {
  return !!(window.__GITHUB_TOKEN__ && window.__GITHUB_REPO_OWNER__ && window.__GITHUB_REPO_NAME__);
}