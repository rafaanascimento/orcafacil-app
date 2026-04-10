import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/login'];

interface MiddlewareCookie {
  name: string;
  value: string;
  options?: Parameters<NextResponse['cookies']['set']>[2];
}
const protectedRoutes = ['/dashboard', '/history'];

const isProtectedRoute = (path: string) => protectedRoutes.some((route) => path.startsWith(route));

const isPublicRoute = (path: string) => publicRoutes.some((route) => path.startsWith(route));

const clearSupabaseCookies = (request: NextRequest, response: NextResponse) => {
  request.cookies
    .getAll()
    .filter((cookie) => cookie.name.startsWith('sb-'))
    .forEach((cookie) => {
      response.cookies.set(cookie.name, '', { path: '/', maxAge: 0 });
    });
};

const loginRedirect = (request: NextRequest, reason: 'session_expired' | 'unauthorized') => {
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('reason', reason);

  const pathname = request.nextUrl.pathname;
  if (pathname && pathname !== '/login') {
    redirectUrl.searchParams.set('next', pathname);
  }

  const response = NextResponse.redirect(redirectUrl);
  clearSupabaseCookies(request, response);
  return response;
};

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet: MiddlewareCookie[]) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if ((error || !user) && isProtectedRoute(request.nextUrl.pathname)) {
      return loginRedirect(request, error ? 'session_expired' : 'unauthorized');
    }

    if (user && isPublicRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch {
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return loginRedirect(request, 'session_expired');
    }

    return response;
  }
};
