interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
}

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isUpcoming: boolean;
  content?: string;
}

export class GitHubAPI {
  private token: string;
  private owner: string;
  private repo: string;
  private baseUrl = 'https://api.github.com';

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = window.__GITHUB_TOKEN__ || '';
      this.owner = window.__GITHUB_REPO_OWNER__ || '';
      this.repo = window.__GITHUB_REPO_NAME__ || '';
      
      console.log('GitHubAPI Constructor - window values:', {
        token: window.__GITHUB_TOKEN__ ? `${window.__GITHUB_TOKEN__.substring(0, 10)}...` : 'Not set',
        owner: window.__GITHUB_REPO_OWNER__,
        repo: window.__GITHUB_REPO_NAME__,
      });
      
      // If values are empty, try to get them from localStorage as fallback
      if (!this.token) {
        const sessionData = localStorage.getItem('admin_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          this.token = session.github_token || '';
          this.owner = session.github_owner || '';
          this.repo = session.github_repo || '';
          console.log('Using fallback from localStorage:', {
            token: this.token ? `${this.token.substring(0, 10)}...` : 'Not set',
            owner: this.owner,
            repo: this.repo,
          });
        }
      }
    } else {
      this.token = '';
      this.owner = '';
      this.repo = '';
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    console.log('GitHub API Request:', {
      url,
      method: options.method || 'GET',
      token: this.token ? `${this.token.substring(0, 10)}...` : 'No token',
      owner: this.owner,
      repo: this.repo,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('GitHub API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API Error Details:', errorData);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    return response.json();
  }

  private encodeContent(content: string): string {
    return btoa(unescape(encodeURIComponent(content)));
  }

  private decodeContent(content: string): string {
    return decodeURIComponent(escape(atob(content)));
  }

  private generateMarkdown(data: EventData): string {
    const frontmatter = `---
title: "${data.title}"
date: "${data.date}"
time: "${data.time}"
location: "${data.location}"
description: "${data.description}"
image: "${data.image}"
isUpcoming: ${data.isUpcoming}
---

${data.content || ''}`;

    return frontmatter;
  }

  private generateFileName(title: string, date: string): string {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 30);
    return `${date}-${cleanTitle}.md`;
  }

  async getEventFiles(): Promise<GitHubFile[]> {
    try {
      const response = await this.request('/repos/{owner}/{repo}/contents/src/content/events'
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo));
      
      return response.filter((file: any) => file.name.endsWith('.md'));
    } catch (error) {
      console.error('Error fetching event files:', error);
      throw error;
    }
  }

  async getEventContent(fileName: string): Promise<string> {
    try {
      const response = await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo));
      
      return this.decodeContent(response.content);
    } catch (error) {
      console.error('Error fetching event content:', error);
      throw error;
    }
  }

  async createEvent(data: EventData): Promise<void> {
    const fileName = this.generateFileName(data.title, data.date);
    const content = this.generateMarkdown(data);
    
    try {
      await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo), {
        method: 'PUT',
        body: JSON.stringify({
          message: `Add new event: ${data.title}`,
          content: this.encodeContent(content),
        }),
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(fileName: string, data: EventData): Promise<void> {
    try {
      // Get current file to obtain SHA
      const currentFile = await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo));

      const content = this.generateMarkdown(data);
      
      await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo), {
        method: 'PUT',
        body: JSON.stringify({
          message: `Update event: ${data.title}`,
          content: this.encodeContent(content),
          sha: currentFile.sha,
        }),
      });
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(fileName: string): Promise<void> {
    try {
      // Get current file to obtain SHA
      const currentFile = await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo));

      await this.request(`/repos/{owner}/{repo}/contents/src/content/events/${fileName}`
        .replace('{owner}', this.owner)
        .replace('{repo}', this.repo), {
        method: 'DELETE',
        body: JSON.stringify({
          message: `Delete event: ${fileName}`,
          sha: currentFile.sha,
        }),
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  parseEventMarkdown(content: string): EventData {
    const frontmatterMatch = content.match(/^---\n(.*?)\n---\n(.*)/s);
    if (!frontmatterMatch) {
      throw new Error('Invalid markdown format');
    }

    const frontmatter = frontmatterMatch[1];
    const eventContent = frontmatterMatch[2].trim();

    const data: any = {};
    frontmatter.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
      if (match) {
        const [, key, value] = match;
        data[key] = value.replace(/^"|"$/g, '');
      }
    });

    return {
      title: data.title || '',
      date: data.date || '',
      time: data.time || '',
      location: data.location || '',
      description: data.description || '',
      image: data.image || '',
      isUpcoming: data.isUpcoming === 'true',
      content: eventContent,
    };
  }
}