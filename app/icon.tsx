import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20, // Slightly smaller font to fit inside the box
          background: 'linear-gradient(to bottom right, #2563eb, #7c3aed)', // Blue to Violet Gradient
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', // White text stands out on the gradient
          borderRadius: '8px', // Rounded corners (like an app icon)
        }}
      >
        ❖
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}