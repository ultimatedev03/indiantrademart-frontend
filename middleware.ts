// middleware.ts - Enhanced subdomain routing with CORS and cookie support
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.ROOT_DOMAIN || 'companyname.com';
const RESERVED = new Set(['www', 'api', 'admin', 'mail', 'ftp', 'localhost', 'static', 'cdn']);

// Define valid subdomains for the application
const VALID_SUBDOMAINS = new Set(['vendor', 'buyer', 'management', 'employee']);

function getHost(req: NextRequest): string {
  const host = req.headers.get('host') ?? '';
  return host.split(':')[0].toLowerCase();
}

function getSubdomain(host: string): string | null {
  // Handle localhost
  if (host === 'localhost' || host.startsWith('127.0.0.1') || host.startsWith('192.168.')) {
    return null;
  }

  // Handle subdomain extraction
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.replace(`.${ROOT_DOMAIN}`, '').split('.')[0].toLowerCase();
    return sub && !RESERVED.has(sub) ? sub : null;
  }

  return null;
}

export function middleware(req: NextRequest) {
  const host = getHost(req);
  if (!host) return NextResponse.next();

  // Allow local development
  if (host === 'localhost' || host.startsWith('127.0.0.1') || host.startsWith('192.168.')) {
    return NextResponse.next();
  }

  // Handle root domain requests
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    const parts = req.nextUrl.pathname.split('/').filter(Boolean);
    const first = parts[0]?.toLowerCase();
    
    // Redirect specific paths to appropriate subdomains
    if (first && VALID_SUBDOMAINS.has(first)) {
      const redirectUrl = new URL(req.nextUrl.toString());
      redirectUrl.hostname = `${first}.${ROOT_DOMAIN}`;
      redirectUrl.pathname = parts.slice(1).join('/') || '/';
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Handle subdomain routing
  const subdomain = getSubdomain(host);
  if (subdomain && VALID_SUBDOMAINS.has(subdomain)) {
    const url = req.nextUrl.clone();
    const response = NextResponse.rewrite(url);

    // Configure CORS headers for subdomain
    response.headers.set('Access-Control-Allow-Origin', `https://${subdomain}.${ROOT_DOMAIN}`);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');

    // Configure cookies to work across subdomains
    // Cookies will be set with domain=.companyname.com to be accessible across subdomains
    response.headers.set('X-Subdomain', subdomain);

    // Handle subdomain-specific routing
    if (url.pathname === '/' || url.pathname === '') {
      // Map subdomain root to appropriate login/dashboard page
      switch (subdomain) {
        case 'vendor':
          url.pathname = '/vendor/login';
          break;
        case 'buyer':
          url.pathname = '/buyer/login';
          break;
        case 'management':
          url.pathname = '/management/login';
          break;
        case 'employee':
          url.pathname = '/employee/login';
          break;
        default:
          url.pathname = `/${subdomain}`;
      }
      return NextResponse.rewrite(url);
    }

    // Prefix paths with subdomain if not already prefixed
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    return response;
  }

  return NextResponse.next();
}

// Exclude static assets, images, API routes, and Next.js internals
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|api|health).*)',
  ],
};
