// src/components/Widget.jsx
import React from 'react';

const Widget = ({ title, value, logo }) => {
  return (
    // Outer card container with Tailwind classes and inline styles for custom gradient/shadow
    <div
      className="w-80 h-60 rounded-[20px] p-[5px] flex justify-center items-center bg-black"
    >
    </div>
  );
};

export default Widget;
