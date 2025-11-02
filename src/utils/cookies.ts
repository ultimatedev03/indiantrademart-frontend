/**
 * Cookie Utility for Cross-Subdomain Support
 * Handles JWT tokens and session data across vendor, buyer, management, and employee subdomains
 */

interface CookieOptions {
  days?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'companyname.com';

/**
 * Get the root domain for cookies
 * In production: .companyname.com (accessible across all subdomains)
 * In localhost: undefined (browser handles it)
 */
function getCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const hostname = window.location.hostname;
  
  // Localhost or IP addresses - don't set domain
  if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return undefined;
  }
  
  // Production: set to root domain with leading dot for subdomain sharing
  return `.${ROOT_DOMAIN}`;
}

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    days = 7,
    path = '/',
    domain = getCookieDomain(),
    secure = true,
    sameSite = 'lax'
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') return;

  const {
    path = '/',
    domain = getCookieDomain(),
  } = options;

  setCookie(name, '', {
    days: -1,
    path,
    domain,
  });
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Auth-specific cookie helpers
 */
export const AuthCookies = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',

  setAuthToken(token: string, refreshToken?: string): void {
    // Set token with 7 days expiry
    setCookie(this.TOKEN_KEY, token, { days: 7, secure: true, sameSite: 'lax' });
    
    if (refreshToken) {
      // Refresh token with 30 days expiry
      setCookie(this.REFRESH_TOKEN_KEY, refreshToken, { days: 30, secure: true, sameSite: 'lax' });
    }
    
    // Also store in localStorage as backup
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  },

  getAuthToken(): string | null {
    // Try cookie first, fallback to localStorage
    return getCookie(this.TOKEN_KEY) || (typeof window !== 'undefined' ? localStorage.getItem(this.TOKEN_KEY) : null);
  },

  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_KEY) || (typeof window !== 'undefined' ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null);
  },

  setUserData(userData: any): void {
    const userString = JSON.stringify(userData);
    setCookie(this.USER_KEY, userString, { days: 7, secure: true, sameSite: 'lax' });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, userString);
    }
  },

  getUserData(): any | null {
    const userString = getCookie(this.USER_KEY) || (typeof window !== 'undefined' ? localStorage.getItem(this.USER_KEY) : null);
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
      }
    }
    return null;
  },

  clearAuth(): void {
    deleteCookie(this.TOKEN_KEY);
    deleteCookie(this.REFRESH_TOKEN_KEY);
    deleteCookie(this.USER_KEY);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  },

  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  },
};

export default {
  setCookie,
  getCookie,
  deleteCookie,
  hasCookie,
  AuthCookies,
};
