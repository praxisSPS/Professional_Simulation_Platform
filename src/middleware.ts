import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ── Route groups ─────────────────────────────────────────────
// Public: accessible without login
const PUBLIC_ROUTES = ['/', '/portfolio']
// Auth-only: redirect to /dashboard if already logged in
const AUTH_ROUTES = ['/', '/onboarding']
// Protected: require login
const PROTECTED_PREFIXES = ['/dashboard', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Portfolio pages are always public — skip auth check
  if (pathname.startsWith('/portfolio')) {
    return NextResponse.next()
  }

  // API routes handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  // Not logged in + trying to access protected route → send to login
  if (!user && isProtected) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in + on login page → check profile first
  if (user && pathname === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('career_path')
      .eq('id', user.id)
      .single()
    if (!profile?.career_path) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Logged in + on /onboarding: check if they already have a career path
  // If they do, send them to dashboard
  if (user && pathname === '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('career_path')
      .eq('id', user.id)
      .single()

    if (profile?.career_path) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Admin routes: check for admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    // Only allow university_admin or pro users to access admin routes
    // In production this would use a separate `role` column
    if (!profile || profile.subscription_tier === 'free') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files and Next internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
