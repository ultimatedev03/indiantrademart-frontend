import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'indiantrademart.com';

const SUBDOMAINS: Record<string, string> = {
  vendor: '/vendor',
  dir: '/directory',
  user: '/user',
  man: '/management',
  employee: '/employee'
};

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const hostname = host.split(':')[0].toLowerCase();

  // Main domain → do nothing
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  const sub = hostname.replace(`.${ROOT_DOMAIN}`, '');

  if (SUBDOMAINS[sub]) {
    const url = req.nextUrl.clone();
    const base = SUBDOMAINS[sub];

    // If visiting root → rewrite to base page
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = base;
      return NextResponse.rewrite(url);
    }

    // If path doesn’t start with base → rewrite inside it
    if (!url.pathname.startsWith(base)) {
      url.pathname = `${base}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
};
