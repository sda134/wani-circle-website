declare global {
  interface Window {
    __ADMIN_PASSWORD__?: string;
    __GITHUB_TOKEN__?: string;
    __GITHUB_REPO_OWNER__?: string;
    __GITHUB_REPO_NAME__?: string;
  }
}

export {};