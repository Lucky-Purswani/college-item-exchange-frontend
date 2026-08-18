import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../utils';
import { Route } from '@/routes/login';
import axios from 'axios';

const LoginPage = Route.options.component;

// Mock the route hooks that are tightly coupled to the router instance
Route.useSearch = vi.fn().mockReturnValue({ reset: false, registered: false });
Route.useNavigate = vi.fn().mockReturnValue(vi.fn());

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@university.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText(/you@university.edu/i), 'invalidemail');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully', async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, data: { user: { displayName: 'John' }, token: 'mocktoken' } }
    });
    axios.get.mockResolvedValueOnce({
      data: { success: true, data: { id: 'u1' } }
    });

    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText(/you@university.edu/i), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText(/••••••••/), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
