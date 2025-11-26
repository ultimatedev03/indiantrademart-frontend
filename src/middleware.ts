// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// subdomain -> path mapping
const SUBDOMAIN_MAP: Record<string, string> = {
  vendor: '/vendor',
  buyer: '/buyer',
  emp: '/employee',
  dir: '/directory',
  man: '/management',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // host: e.g. vendor.indiantrademart.com, man.localhost:3000
  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0]      // dev mode :3000 hataane ke liye
  const subdomain = hostname.split('.')[0] // "vendor", "buyer", "emp", "dir", "man", ...

  const targetPath = SUBDOMAIN_MAP[subdomain]

  // 🔐 1) Saare auth routes ko rewrite se bacha do
  //     Example:
  //     /auth/vendor/...
  //     /auth/buyer/...
  //     /auth/employee/...
  //     /auth/directory/...
  //     /auth/management/...
  //     /auth/admin/...
  //     /auth/cto/...
  //     /auth/hr/...
  //     Host kuch bhi ho (localhost, vendor., man. etc) → as-is serve honge.
  if (url.pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // 2) Baaki sab pe subdomain -> path mapping
  if (targetPath && !url.pathname.startsWith(targetPath)) {
    const extra = url.pathname === '/' ? '' : url.pathname
    url.pathname = targetPath + extra
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// static assets par middleware mat chalana
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
