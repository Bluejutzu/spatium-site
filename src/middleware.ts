import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const ADMIN_USER_ID = 'user_2zXUzb3SvZFILg0JQcYlrv0KUkY';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/servers(.*)',
  '/api(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  // Protect admin routes
  if (isAdminRoute(req)) {
    const session = await auth.protect();
    if (session.userId !== ADMIN_USER_ID) {
      return new Response('Unauthorized', { status: 403 });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
