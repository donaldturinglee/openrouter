import {configure} from '@testing-library/dom';
import {cleanup} from '@testing-library/react';
import {afterEach} from 'vitest';

import '@testing-library/jest-dom/vitest';

// A page is fetched on the way to it, so a test that reaches one through the
// router waits on a real dynamic import, which pulls in the design system and
// can take longer than the one second that an async query waits by default.
configure({asyncUtilTimeout: 5_000});

// The router restores the scroll position, which jsdom leaves unimplemented
// and reports on every call.
window.scrollTo = () => {};

// Vitest doesn't run with globals, so Testing Library can't register its own
// cleanup, and each test would find what the one before it rendered.
afterEach(() => {
  cleanup();
});
