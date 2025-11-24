// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'indiantrademart.com';

const SUBDOMAINS: Record<string, string> = {
  vendor: '/vendor',
  dir: '/directory',
  user: '/user',
  man: '/management',
  employee: '/employee',
};

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  // root domain -> no rewrite
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  const sub = hostname.replace(`.${ROOT_DOMAIN}`, '');

  if (SUBDOMAINS[sub]) {
    const url = req.nextUrl.clone();
    const base = SUBDOMAINS[sub];

    // landing -> send to base page
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = base;
      return NextResponse.rewrite(url);
    }

    // keep routing inside vendor pages
    if (!url.pathname.startsWith(base)) {
      url.pathname = `${base}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)'
  ],
};
