import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Evita chiamate reali al backend durante i test del frontend.
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: [] }),
    })
  );
});

test('renders blog homepage', async () => {
  render(<App />);
  const linkElement = screen.getByText(/Benvenuto sullo Strive Blog/i);
  expect(linkElement).toBeInTheDocument();

  await waitFor(() => expect(global.fetch).toHaveBeenCalled());
});
