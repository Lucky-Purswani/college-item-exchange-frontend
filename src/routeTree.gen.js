/* eslint-disable */
// This file is manually maintained (no TS plugin) for pure JS routing.

import { Route as rootRouteImport } from './routes/__root'
import { Route as RegisterRouteImport } from './routes/register'
import { Route as LoginRouteImport } from './routes/login'
import { Route as ErrorRouteImport } from './routes/error'
import { Route as ForgotPasswordRouteImport } from './routes/forgot-password'
import { Route as ResetPasswordRouteImport } from './routes/reset-password'
import { Route as VerifyEmailRouteImport } from './routes/verify-email'
import { Route as ProtectedRouteImport } from './routes/_protected'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ProtectedStatsRouteImport } from './routes/_protected/stats'
import { Route as ProtectedMyListingsRouteImport } from './routes/_protected/my-listings'
import { Route as ProtectedListingsRouteImport } from './routes/_protected/listings'
import { Route as ProtectedHomeRouteImport } from './routes/_protected/home'
import { Route as ProtectedProfileIndexRouteImport } from './routes/_protected/profile/index'
import { Route as ProtectedProfileEditRouteImport } from './routes/_protected/profile/edit'
import { Route as ProtectedListingIdRouteImport } from './routes/_protected/listing/$id'
import { Route as ProtectedListingIdEditRouteImport } from './routes/_protected/listing/$id.edit'
import { Route as ProtectedListingNewRouteImport } from './routes/_protected/listing/new'
import { Route as AdminRouteImport } from './routes/_admin'
import { Route as AdminDashboardRouteImport } from './routes/_admin/admin'
import { Route as ProtectedChatIndexRouteImport } from './routes/_protected/chat/index'
import { Route as ProtectedChatIdRouteImport } from './routes/_protected/chat/$id'

const ForgotPasswordRoute = ForgotPasswordRouteImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRouteImport,
})

const ResetPasswordRoute = ResetPasswordRouteImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRouteImport,
})

const VerifyEmailRoute = VerifyEmailRouteImport.update({
  id: '/verify-email',
  path: '/verify-email',
  getParentRoute: () => rootRouteImport,
})

const RegisterRoute = RegisterRouteImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRouteImport,
})

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
})

const ErrorRoute = ErrorRouteImport.update({
  id: '/error',
  path: '/error',
  getParentRoute: () => rootRouteImport,
})

const ProtectedRoute = ProtectedRouteImport.update({
  id: '/_protected',
  getParentRoute: () => rootRouteImport,
})

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
})

const ProtectedStatsRoute = ProtectedStatsRouteImport.update({
  id: '/stats',
  path: '/stats',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedMyListingsRoute = ProtectedMyListingsRouteImport.update({
  id: '/my-listings',
  path: '/my-listings',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedListingsRoute = ProtectedListingsRouteImport.update({
  id: '/listings',
  path: '/listings',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedHomeRoute = ProtectedHomeRouteImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedProfileIndexRoute = ProtectedProfileIndexRouteImport.update({
  id: '/profile/',
  path: '/profile/',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedListingIdRoute = ProtectedListingIdRouteImport.update({
  id: '/listing/$id',
  path: '/listing/$id',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedListingIdEditRoute = ProtectedListingIdEditRouteImport.update({
  id: '/listing/$id/edit',
  path: '/listing/$id/edit',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedListingNewRoute = ProtectedListingNewRouteImport.update({
  id: '/listing/new',
  path: '/listing/new',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedProfileEditRoute = ProtectedProfileEditRouteImport.update({
  id: '/profile/edit',
  path: '/profile/edit',
  getParentRoute: () => ProtectedRoute,
})

const AdminRoute = AdminRouteImport.update({
  id: '/_admin',
  getParentRoute: () => rootRouteImport,
})

const AdminDashboardRoute = AdminDashboardRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => AdminRoute,
})

const ProtectedChatIndexRoute = ProtectedChatIndexRouteImport.update({
  id: '/chat/',
  path: '/chat/',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedChatIdRoute = ProtectedChatIdRouteImport.update({
  id: '/chat/$id',
  path: '/chat/$id',
  getParentRoute: () => ProtectedRoute,
})

const ProtectedRouteWithChildren = ProtectedRoute._addFileChildren({
  ProtectedHomeRoute,
  ProtectedListingsRoute,
  ProtectedMyListingsRoute,
  ProtectedStatsRoute,
  ProtectedListingIdRoute,
  ProtectedListingIdEditRoute,
  ProtectedListingNewRoute,
  ProtectedProfileIndexRoute,
  ProtectedProfileEditRoute,
  ProtectedChatIndexRoute,
  ProtectedChatIdRoute,
})

const AdminRouteWithChildren = AdminRoute._addFileChildren({
  AdminDashboardRoute,
})

export const routeTree = rootRouteImport._addFileChildren({
  IndexRoute,
  ProtectedRoute: ProtectedRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
  ErrorRoute,
  LoginRoute,
  RegisterRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
  VerifyEmailRoute,
})
