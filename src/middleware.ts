// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// MAIN domain (prod)
const MAIN_DOMAIN = 'indiantrademart.com'

// subdomain -> path mapping
const SUBDOMAIN_MAP: Record<string, string> = {
  vendor: '/vendor',
  buyer: '/buyer',
  emp: '/employee',
  dir: '/directory',
  man: '/management',
}

// helper: given desired subdomain, correct URL banao
function buildSubdomainRedirectUrl(
  req: NextRequest,
  host: string,
  hostname: string,
  sub: string
) {
  const redirectUrl = req.nextUrl.clone()
  const isLocalhost = hostname.includes('localhost')
  const currentPort = host.split(':')[1] || ''

  if (isLocalhost) {
    // dev: vendor.localhost:3000, buyer.localhost:3000, dir.localhost:3000 ...
    redirectUrl.hostname = `${sub}.localhost`
    if (currentPort) redirectUrl.port = currentPort
  } else {
    // prod: vendor.indiantrademart.com, buyer.indiantrademart.com, dir.indiantrademart.com
    redirectUrl.hostname = `${sub}.${MAIN_DOMAIN}`
    redirectUrl.port = ''
  }

  return redirectUrl
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // 0) STATIC ASSETS KO SKIP KARO (logo.png, .css, .js, etc.)
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next()
  }

  const host = req.headers.get('host') || ''  // e.g. buyer.localhost:3000
  const hostname = host.split(':')[0]         // buyer.localhost
  const subdomain = hostname.split('.')[0]    // buyer / vendor / dir / ...
  
  // Extract base domain (indiantrademart.com or localhost)
  const isLocalhost = hostname.includes('localhost')
  const baseDomain = isLocalhost ? 'localhost' : MAIN_DOMAIN

  const targetPath = SUBDOMAIN_MAP[subdomain]

  // 0.5) AUTH ROUTES KO Sahi SUBDOMAIN PAR BHEJO

  // /auth/vendor/... -> vendor subdomain (agar already vendor pe nahi ho)
  if (pathname.startsWith('/auth/vendor/') && subdomain !== 'vendor') {
    const redirectUrl = buildSubdomainRedirectUrl(req, host, hostname, 'vendor')
    return NextResponse.redirect(redirectUrl)
  }

  // /auth/user/... -> buyer subdomain (agar already buyer pe nahi ho)
  if (pathname.startsWith('/auth/user/') && subdomain !== 'buyer') {
    const redirectUrl = buildSubdomainRedirectUrl(req, host, hostname, 'buyer')
    return NextResponse.redirect(redirectUrl)
  }

  // 0.6) DIRECTORY ROUTES KO dir SUBDOMAIN PAR BHEJO
  // /directory or /directory/...  -> dir subdomain (agar already dir pe nahi ho)
  if (
    (pathname === '/directory' || pathname.startsWith('/directory/')) &&
    subdomain !== 'dir'
  ) {
    const redirectUrl = buildSubdomainRedirectUrl(req, host, hostname, 'dir')
    return NextResponse.redirect(redirectUrl)
  }

  // 1) AUTH ROUTES KO REWRITE SE BACHAAO
  // (ab yahan sirf wahi auth URL aayenge jo already sahi subdomain par hain)
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // 2) Directory SEO URLs on dir. subdomain
  // For dir.indiantrademart.com, rewrite root-level SEO paths to /directory/...
  // e.g. /land-surveyors → /directory/land-surveyors
  // e.g. /peb-building-design-consultant-in-visakhapatnam-andhra-pradesh → /directory/peb-...
  if (subdomain === 'dir') {
    const reservedPrefixes = [
      '/directory',
      '/api',
      '/_next',
      '/dashboard',
      '/auth',
      '/static',
      '/assets',
      '/favicon',
    ]

    const isReserved = reservedPrefixes.some((prefix) =>
      pathname === prefix || pathname.startsWith(prefix + '/')
    )

    // Root path / → keep as-is
    // Reserved prefixes → keep as-is
    // Any other path → rewrite to /directory/...
    if (pathname !== '/' && !isReserved && !pathname.startsWith('/directory')) {
      url.pathname = `/directory${pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // 2.5) Main domain root-level SEO slugs -> redirect to dir subdomain
  // Applies to main domain (no subdomain) or 'www' subdomain
  if (subdomain === '' || subdomain === 'www') {
    const reservedMainPrefixes = [
      '/api',
      '/_next',
      '/dashboard',
      '/auth',
      '/static',
      '/assets',
      '/favicon',
      '/directory',
      '/vendor',
      '/buyer',
      '/employee',
      '/management',
    ]

    const isReservedMain = reservedMainPrefixes.some((prefix) =>
      pathname === prefix || pathname.startsWith(prefix + '/')
    )

    if (pathname !== '/' && !isReservedMain) {
      const targetUrl = req.nextUrl.clone()
      // Redirect to dir subdomain with same path
      targetUrl.hostname = isLocalhost ? `dir.localhost` : `dir.${baseDomain}`
      // Preserve port for localhost dev
      if (isLocalhost) {
        const currentPort = host.split(':')[1] || ''
        if (currentPort) targetUrl.port = currentPort
      } else {
        targetUrl.port = ''
      }
      return NextResponse.redirect(targetUrl, 308)
    }
  }

  // 3) Baaki sab pe subdomain -> path mapping (existing logic)
  // BUT: Skip rewriting for /dashboard/* routes - they live at the same path on all subdomains
  const isDashboardRoute = pathname.startsWith('/dashboard')
  if (targetPath && !pathname.startsWith(targetPath) && !isDashboardRoute) {
    const extra = pathname === '/' ? '' : pathname
    url.pathname = targetPath + extra
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// static assets par middleware mat chalana
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
