import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for testing
      cacheTime: 0,
    },
  },
});

import { createRouter, createMemoryHistory, createRootRoute, createRoute, RouterProvider } from '@tanstack/react-router';

export function customRender(ui, renderOptions = {}) {
  const testQueryClient = createTestQueryClient();

  const Wrapper = ({ children }) => {
    return (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  return {
    wrapper: Wrapper,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { customRender as render };
