import {render, screen} from '@testing-library/react';
import {RouterProvider, createMemoryRouter} from 'react-router';
import {describe, expect, it} from 'vitest';

import {buildRoutes} from '@/router';

describe('buildRoutes', () => {
  it('serves home at the site root', async () => {
    const router = createMemoryRouter(buildRoutes(), {initialEntries: ['/']});

    render(<RouterProvider router={router} />);

    // The page is fetched on the way to it, so its heading is waited for.
    expect(
      await screen.findByRole('heading', {name: 'openrouter', level: 1}),
    ).toBeInTheDocument();
  });
});
