import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver for some React components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      create: vi.fn(function() { return this; }),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
      }
    }
  }
});

// Mock TanStack Router
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createFileRoute: () => (options) => ({
      options,
      useSearch: () => ({}),
      useNavigate: () => vi.fn(),
    }),
    useNavigate: () => vi.fn(),
    useRouter: () => ({ history: { push: vi.fn() }, state: { location: { pathname: '/' } } }),
    useLocation: () => ({ pathname: '/' }),
    useSearch: () => ({}),
    useParams: () => ({}),
    Link: ({ children, to }) => React.createElement('a', { href: to }, children),
    Navigate: () => React.createElement('div', null, 'Redirecting'),
  }
});
