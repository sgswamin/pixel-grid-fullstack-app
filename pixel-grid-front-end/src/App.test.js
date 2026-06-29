import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the pixel grid heading', () => {
  render(<App />);
  const heading = screen.getByText(/pixel grid/i);
  expect(heading).toBeInTheDocument();
});
