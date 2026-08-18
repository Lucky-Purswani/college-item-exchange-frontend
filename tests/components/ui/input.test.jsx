import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('allows user to type', async () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Username" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Username');
    await userEvent.type(input, 'testuser');
    
    expect(input).toHaveValue('testuser');
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be disabled', async () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    
    await userEvent.type(input, 'try typing');
    expect(input).toHaveValue(''); // Shouldn't change
  });
});
