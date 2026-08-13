import React from 'react';

interface QRCodeSVGProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 160,
  fgColor = '#10B981', // Emerald 500
  bgColor = '#020617', // Slate 950
}) => {
  // Deterministic pattern generator based on string hash
  const getHashMatrix = (str: string) => {
    const grid = 21; // 21x21 QR Version 1 grid
    const matrix: boolean[][] = Array(grid).fill(false).map(() => Array(grid).fill(false));

    // Fill timing patterns and finder patterns
    const drawFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[row + r][col + c] = true;
          }
        }
      }
    };

    drawFinder(0, 0); // Top-left
    drawFinder(0, 14); // Top-right
    drawFinder(14, 0); // Bottom-left

    // Seed data
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
        
        // Alignment pattern
        if (r >= 13 && r <= 17 && c >= 13 && c <= 17) {
          if (r === 13 || r === 17 || c === 13 || c === 17 || (r === 15 && c === 15)) {
            matrix[r][c] = true;
          }
          continue;
        }

        // Timing pattern
        if (r === 6 || c === 6) {
          matrix[r][c] = (r + c) % 2 === 0;
          continue;
        }

        const pseudoBit = ((hash ^ (r * 31 + c * 17)) & 1) === 1;
        matrix[r][c] = pseudoBit;
      }
    }

    return matrix;
  };

  const matrix = getHashMatrix(value);
  const cellSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl overflow-hidden shadow-lg border border-emerald-500/30">
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) => (
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill={fgColor}
              rx={cellSize > 6 ? 1 : 0}
            />
          ) : null
        ))
      )}
    </svg>
  );
};
