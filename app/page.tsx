'use client';

import React, { useState } from 'react';
import NYCtrip from './components/NYCtrip';
import Westtrip from './components/Westtrip';

type MainTab = 'nyc' | 'west';

export default function Page() {
  const [activeTab, setActiveTab] = useState<MainTab>(() => {
  if (typeof window === 'undefined') return 'nyc';

  const saved = window.localStorage.getItem('trip-tab');

  if (saved === 'nyc' || saved === 'west') {
    return saved;
  }

  return 'nyc';
});

const changeTab = (tab: MainTab) => {
  setActiveTab(tab);
  window.localStorage.setItem('trip-tab', tab);
};

  return (
    <main>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          gap: 8,
          padding: 12,
          background: '#0b1220',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <button
          type="button"
          onClick={() => changeTab('nyc')}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 14,
            border: 'none',
            fontWeight: 800,
            cursor: 'pointer',
            background:
              activeTab === 'nyc'
                ? 'linear-gradient(135deg, #2563eb, #7c3aed)'
                : 'rgba(255,255,255,0.10)',
            color: '#fff',
          }}
        >
          🗽 New York
        </button>

        <button
          type="button"
          onClick={() => changeTab('west')}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 14,
            border: 'none',
            fontWeight: 800,
            cursor: 'pointer',
            background:
              activeTab === 'west'
                ? 'linear-gradient(135deg, #ea580c, #92400e)'
                : 'rgba(255,255,255,0.10)',
            color: '#fff',
          }}
        >
          🌵 Ouest
        </button>
      </div>

      {activeTab === 'nyc' ? <NYCtrip /> : <Westtrip />}
    </main>
  );
}