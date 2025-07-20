import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  console.log('Testing GitHub API with:', {
    token: token ? `${token.substring(0, 10)}...` : 'No token',
    owner,
    repo,
  });

  try {
    // Test GitHub API authentication
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'GitHub API test failed',
        status: response.status,
        statusText: response.statusText,
        data,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test repository access
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const repoData = await repoResponse.json();

    return new Response(JSON.stringify({
      user: data,
      repository: repoData,
      status: 'success',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      status: 'error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};