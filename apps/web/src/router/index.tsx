import {
  LocaleProvider,
  Spinner,
  ThemeProvider,
} from '@gamecrafters/base-ui/react';
import {Suspense} from 'react';
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
  type RouteObject,
} from 'react-router';

import {ROUTES} from './routes';

function LazyFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner />
    </div>
  );
}

function RootLayout() {
  return (
    // The design system reads its locale and its colors from these providers,
    // so every page is rendered inside them.
    <LocaleProvider>
      <ThemeProvider colorMode="auto" className="min-h-dvh">
        <ScrollRestoration />
        <Suspense fallback={<LazyFallback />}>
          <Outlet />
        </Suspense>

        {/* The design system portals its overlays into this element, which
            keeps them inside the theme and so in its colors. */}
        <div data-portal-root />
      </ThemeProvider>
    </LocaleProvider>
  );
}

/** Returns the route tree: every page of ROUTES inside the root layout. */
export function buildRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      Component: RootLayout,
      children: ROUTES.map(({path, component}): RouteObject => ({
        path,
        Component: component,
      })),
    },
  ];
}

// Created on the first render rather than on import, so that importing this
// module, as the tests do, doesn't start a router on the window's history.
let browserRouter: ReturnType<typeof createBrowserRouter> | undefined;

/** Serves the pages of the app at their paths. */
export function Router() {
  browserRouter ??= createBrowserRouter(buildRoutes());

  return <RouterProvider router={browserRouter} />;
}
