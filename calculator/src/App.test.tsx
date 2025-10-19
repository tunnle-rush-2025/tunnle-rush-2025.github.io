import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';

describe('Calculator integration', () => {
  it('performs a simple addition via clicking', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(screen.getByRole('region', { name: /display/i })).toHaveTextContent('3');
  });

  it('supports keyboard input and backspace', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('12+3');
    // backspace to delete 3
    await user.keyboard('{Backspace}');
    await user.keyboard('4{Enter}');
    expect(screen.getByRole('region', { name: /display/i })).toHaveTextContent('16');
  });

  it('esc clears', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard('9*9{Enter}');
    await user.keyboard('{Escape}');
    const region = screen.getByRole('region', { name: /display/i });
    expect(region).toHaveTextContent('0');
  });
});
