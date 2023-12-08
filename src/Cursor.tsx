import React, { FC } from 'react';

interface Props {
  x?: number;
  y?: number;
  color: string;
  hue: string;
  isLocalClient?: boolean;
  userId: string;
}

export const Cursor: FC<Props> = ({
  x,
  y,
  color,
  hue,
  isLocalClient,
  userId,
}) => {
  // Don't show cursor for the local client
  const _isLocalClient = !x || !y || isLocalClient;

  if (_isLocalClient) return null;

  return (
    <div
      style={{
        zIndex: 50,
      }}
    >
      <svg
        width="18"
        height="24"
        viewBox="0 0 18 24"
        fill="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.2s ease',
          opacity: 0.7,
          pointerEvents: 'none',
          color,
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.717 2.22918L15.9831 15.8743C16.5994 16.5083 16.1503 17.5714 15.2661 17.5714H9.35976C8.59988 17.5714 7.86831 17.8598 7.3128 18.3783L2.68232 22.7C2.0431 23.2966 1 22.8434 1 21.969V2.92626C1 2.02855 2.09122 1.58553 2.717 2.22918Z"
          fill={color}
          stroke={hue}
          strokeWidth="1"
        />
      </svg>
      <span
        style={{
          position: 'absolute',
          zIndex: 50,
          padding: '0 0.5rem',
          fontSize: '0.75rem',
          color: 'white',
          transition: 'transform 0.2s ease',
          border: '1px solid',
          borderRadius: '0.25rem',
          opacity: 0.7,
          pointerEvents: 'none',
          top: '1.5rem',
          left: '0.5rem',
          backgroundColor: color,
          borderColor: hue,
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
      >
        {userId}
      </span>
    </div>
  );
};
