import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase Middleware
 * 
 * This middleware:
 * 1. Refreshes the user's session if expired
 * 2. Protects routes that require authentication
 * 3. Redirects based on user role
 */
export async function updateSession(request: NextRequest) {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, skip auth middleware (development mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '⚠️  Supabase not configured. Auth middleware skipped.\n' +
      'Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'See docs/environment-setup.md for instructions.'
    );
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error('Middleware auth error:', error);
    // If auth fails, allow the request to continue
    // Server-side route protection will handle it
    return supabaseResponse;
  }

  // Protected routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isStudentPage = request.nextUrl.pathname.startsWith('/student');

  // Redirect logged-in users away from auth pages
  if (user && isAuthPage) {
    try {
      // Get user role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error in middleware:', profileError);
        // If profile doesn't exist, logout and redirect to register
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/register', request.url));
      }

      const redirectUrl = profile.role === 'admin' ? '/admin' : '/student';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch (error) {
      console.error('Profile fetch error:', error);
      // On error, logout user
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect non-authenticated users to login
  if (!user && (isAdminPage || isStudentPage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (user && (isAdminPage || isStudentPage)) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Prevent admin from accessing student pages and vice versa
      if (profile?.role === 'admin' && isStudentPage) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      if (profile?.role === 'student' && isAdminPage) {
        return NextResponse.redirect(new URL('/student', request.url));
      }
    } catch (error) {
      console.error('Role check error:', error);
      // If role check fails, allow the request
      // Server-side requireRole will catch unauthorized access
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
