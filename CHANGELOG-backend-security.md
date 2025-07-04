# Backend Security Changelog

## [Date: YYYY-MM-DD]

### Secured API Routes & Added Logging

- **src/lib/auth.ts**
  - Added `logDeniedAccess` utility to log denied access attempts with user info, route, and reason.

- **src/app/api/user/route.ts**
  - Added authorization check for `user:read` permission after session verification.
  - Logs and returns 403 Forbidden if permission is missing.

- **src/app/api/onboarding/route.ts**
  - Added authorization check for `user:update` permission after session verification.
  - Logs and returns 403 Forbidden if permission is missing.

- **src/app/api/onboarding/status/route.ts**
  - Added authorization check for `user:read` permission after session verification.
  - Logs and returns 403 Forbidden if permission is missing.

## [Date: YYYY-MM-DD] (Frontend)

### Secured Frontend Pages with RBAC

- **src/components/AuthProvider.tsx**
  - Added `useRequireAuth` hook to require authentication and (optionally) specific roles or permissions for pages/components.

- **src/app/dashboard/page.tsx**
  - Now requires authentication and `user:read` permission to access. Redirects to `/login` if not allowed.

- **src/app/onboarding/page.tsx**
  - Now requires authentication and `user:update` permission to access. Redirects to `/login` if not allowed.

---

All changes ensure that insufficient permissions are denied and logged for security auditing.

Use `useRequireAuth` for future RBAC-based page protection. 