import {lazy, type ComponentType} from 'react';

/** A page of the app, and the path it's served at. */
export interface Route {
  key: string;
  path: string;
  component: ComponentType;
}

/**
 * Every page the app serves. A page is fetched when it's first visited, so
 * arriving at one doesn't load the code of the others.
 */
export const ROUTES = [
  {
    key: 'home',
    path: '/',
    // A page exports itself by name, and lazy reads a default export.
    component: lazy(async () => {
      const {Home} = await import('@/features/home/Home');
      return {default: Home};
    }),
  },
] as const satisfies readonly Route[];
