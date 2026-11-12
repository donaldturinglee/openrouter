import {Heading} from '@gamecrafters/base-ui/react';

/** The page served at the site root. */
export function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <Heading as="h1" size="large">
        openrouter
      </Heading>
    </main>
  );
}
