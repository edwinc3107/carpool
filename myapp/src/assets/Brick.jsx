// Brick.jsx
import React from 'react';

function Brick({ title, description, graphic, reverse }) {
  const contentOrder = reverse ? 'order-last sm:order-first' : 'order-first sm:order-last';
  const imageOrder = reverse ? 'order-first sm:order-last' : 'order-last sm:order-first';

  return (
    <div
      className="
        grid grid-cols-1 sm:grid-cols-2 gap-8 items-center
        py-30 px-5 sm:px-10 mb-8 
      "
    >
      <div className={`flex flex-col justify-center text-center sm:text-left ${contentOrder}`}>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          {title}
        </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {description}
          </p>
      </div>

      <div className={`flex justify-center items-center ${imageOrder}`}>
        {graphic ? (
          graphic
        ) : (
          <div className="bg-gray-200 rounded-lg w-full h-48 sm:h-64 flex items-center justify-center text-gray-500">
            Image/Graphic Placeholder
          </div>
        )}
      </div>
    </div>
  );
}

export default Brick;