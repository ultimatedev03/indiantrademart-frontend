// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'indiantrademart.com';

const VALID_SUBDOMAINS: Record<string, string> = {
  vendor: '/vendor',
  dir: '/directory',
  user: '/user',
  man: '/management',
  employee: '/employee',
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

    if (subdomain in VALID_SUBDOMAINS) {
      const url = req.nextUrl.clone();
      const basePath = VALID_SUBDOMAINS[subdomain];

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
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
