// middleware.ts - Corrected for indiantrademart.com and proper subdomain routing
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'indiantrademart.com';

const VALID_SUBDOMAINS: Record<string, string> = {
  vendor: '/auth/vendor',
  dir: '/directory',
  user: '/auth/user',
  man: '/auth/management',
  employee: '/auth/employee', // ✅ added
};

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  const parts = hostname.split(`.${ROOT_DOMAIN}`);

  if (parts.length > 1) {
    const subdomain = parts[0];

    if (Object.prototype.hasOwnProperty.call(VALID_SUBDOMAINS, subdomain)) {
      const url = req.nextUrl.clone();
      const basePath = VALID_SUBDOMAINS[subdomain as keyof typeof VALID_SUBDOMAINS];

      if (url.pathname === '/' || url.pathname === '') {
        url.pathname = `${basePath}/login`;
        return NextResponse.rewrite(url);
      }

      if (!url.pathname.startsWith(basePath)) {
        url.pathname = `${basePath}${url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|api).*)',
  ],
};
