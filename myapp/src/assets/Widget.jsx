// src/components/Widget.jsx
import React from 'react';

const Widget = ({ title, value, logo }) => {
  return (
    // Outer card container with Tailwind classes and inline styles for custom gradient/shadow
          <div className="flex justify-center gap-10 m-20 pt-10 pb-90 border-b border-gray-300">
            <div
  class="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20"
>
  <div
    class="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30"
  ></div>
  <div class="absolute inset-px rounded-[11px] bg-slate-950"></div>

  <div class="relative">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500"
        >
          <svg
            class="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <h3 class="text-sm font-semibold text-white">Analytics</h3>
      </div>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-4">
      <div class="rounded-lg bg-slate-900/50 p-3">
        <p class="text-xs font-medium text-slate-400 flex">{title} <p>{logo}</p></p>
        <p class="text-lg font-semibold text-white">24.5K</p>
        <span class="text-xs font-medium text-emerald-500">+12.3%</span>
      </div>

      <div class="rounded-lg bg-slate-900/50 p-3">
        <p class="text-xs font-medium text-slate-400"></p>
        <p class="text-lg font-semibold text-white">1.2K</p>
        <span class="text-xs font-medium text-emerald-500">+8.1%</span>
      </div>
    </div>
</div>
        </div></div>
  );
};

export default Widget;
