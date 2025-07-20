import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

// Function to load .env file manually
function loadEnvVars() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
}

export const POST: APIRoute = async ({ request }) => {
  let password: string | null = null;
  
  try {
    console.log('Request method:', request.method);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);
    
    if (rawBody) {
      const body = JSON.parse(rawBody);
      console.log('Parsed body:', body);
      password = body.password;
      console.log('Extracted password:', password);
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
  }
  
  // Load environment variables manually
  const envVars = loadEnvVars();
  const adminPassword = envVars.ADMIN_PASSWORD || 'wani'; // fallback for development
  
  console.log('Received password:', password);
  console.log('Expected password:', adminPassword);
  console.log('Loaded env vars:', {
    ADMIN_PASSWORD: envVars.ADMIN_PASSWORD,
    GITHUB_TOKEN: envVars.GITHUB_TOKEN ? 'Set' : 'Not set',
    GITHUB_REPO_OWNER: envVars.GITHUB_REPO_OWNER,
    GITHUB_REPO_NAME: envVars.GITHUB_REPO_NAME,
  });
  
  if (!password || password !== adminPassword) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized',
      debug: {
        receivedPassword: password,
        expectedPasswordSet: !!adminPassword,
      }
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({
    ADMIN_PASSWORD: adminPassword,
    GITHUB_TOKEN: envVars.GITHUB_TOKEN || '',
    GITHUB_REPO_OWNER: envVars.GITHUB_REPO_OWNER || 'sda134',
    GITHUB_REPO_NAME: envVars.GITHUB_REPO_NAME || 'wani-circle-website',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const GET: APIRoute = async ({ request }) => {
  const password = new URL(request.url).searchParams.get('password');
  
  // Load environment variables manually
  const envVars = loadEnvVars();
  const adminPassword = envVars.ADMIN_PASSWORD || 'wani'; // fallback for development
  
  console.log('GET - Received password:', password);
  console.log('GET - Expected password:', adminPassword);
  
  if (!password || password !== adminPassword) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized',
      debug: {
        receivedPassword: password,
        expectedPasswordSet: !!adminPassword,
      }
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({
    ADMIN_PASSWORD: adminPassword,
    GITHUB_TOKEN: envVars.GITHUB_TOKEN || '',
    GITHUB_REPO_OWNER: envVars.GITHUB_REPO_OWNER || 'sda134',
    GITHUB_REPO_NAME: envVars.GITHUB_REPO_NAME || 'wani-circle-website',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};