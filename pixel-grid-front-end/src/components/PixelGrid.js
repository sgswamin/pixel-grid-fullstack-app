import { useEffect, useState } from 'react';

function PixelGrid() {
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const fetchGrid = () => {
    return fetch('http://localhost:3000/grid')
      .then((response) => response.json())
      .then((data) => {
        setGrid(data.grid || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load grid data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGrid();
  }, []);

  const handleCellClick = (x, y) => {
    return fetch('http://localhost:3000/grid/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, color: selectedColor }),
    })
      .then((response) => response.json())
      .then(() => {
        return fetchGrid();
      })
      .catch((error) => {
        console.error('Failed to update cell:', error);
      });
  };

  const handleClearGrid = () => {
    return fetch('http://localhost:3000/grid/clear', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then(() => {
        return fetchGrid();
      })
      .catch((error) => {
        console.error('Failed to clear grid:', error);
      });
  };

  const handleFillAll = () => {
    return fetch('http://localhost:3000/grid/fill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: selectedColor }),
    })
      .then((response) => response.json())
      .then(() => {
        return fetchGrid();
      })
      .catch((error) => {
        console.error('Failed to fill grid:', error);
      });
  };

  const maxX = Math.max(...grid.map((cell) => cell.x), 0);
  const maxY = Math.max(...grid.map((cell) => cell.y), 0);
  const totalCells = (maxX + 1) * (maxY + 1);
  const cellLookup = new Map(grid.map((cell) => [`${cell.x}-${cell.y}`, cell]));

  return (
    <div className="pixel-grid-wrapper">
      <h2>Pixel Grid</h2>
      <div className="color-picker-row">
        <label htmlFor="pixel-color">Brush color:</label>
        <input
          id="pixel-color"
          type="color"
          value={selectedColor}
          onChange={(event) => setSelectedColor(event.target.value)}
        />
        <span className="color-preview" style={{ backgroundColor: selectedColor }} />
        <button type="button" className="clear-button" onClick={handleClearGrid}>
          Clear Grid
        </button>
        <button type="button" className="clear-button" onClick={handleFillAll}>
          Fill All
        </button>
      </div>
      {loading ? (
        <p>Loading grid...</p>
      ) : (
        <div
          className="pixel-grid"
          style={{ gridTemplateColumns: `repeat(${maxX + 1}, 20px)` }}
        >
          {Array.from({ length: totalCells }).map((_, index) => {
            const x = index % (maxX + 1);
            const y = Math.floor(index / (maxX + 1));
            const cell = cellLookup.get(`${x}-${y}`);
            const color = cell?.color || 'white';

            return (
              <button
                key={`${x}-${y}`}
                className="pixel-cell"
                style={{ backgroundColor: color }}
                title={`(${x}, ${y}) ${color}`}
                onClick={() => handleCellClick(x, y)}
                type="button"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PixelGrid;
