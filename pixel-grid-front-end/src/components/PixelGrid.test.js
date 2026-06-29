import { render, screen, waitFor } from '@testing-library/react';
import PixelGrid from './PixelGrid';

describe('PixelGrid', () => {
  it('loads and displays grid data from the backend', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ grid: [{ x: 0, y: 0, color: 'red' }] }),
    });

    render(<PixelGrid />);

    expect(screen.getByText(/loading grid/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTitle('(0, 0) red')).toBeInTheDocument();
    });
  });

  it('updates a cell color when clicked', async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [{ x: 0, y: 0, color: 'white' }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cell: { x: 0, y: 0, color: 'black' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ grid: [{ x: 0, y: 0, color: 'black' }] }),
      });

    global.fetch = fetchMock;

    render(<PixelGrid />);

    await waitFor(() => {
      expect(screen.getByTitle('(0, 0) white')).toBeInTheDocument();
    });

    screen.getByTitle('(0, 0) white').click();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/grid/update',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ x: 0, y: 0, color: '#000000' }),
        }),
      );
    });
  });
});
