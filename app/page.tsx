'use client';

import { supabase } from '@/lib/supabase';
import React, { useEffect, useMemo, useState } from 'react';

type TripItem = {
  id: string;
  title: string;
  transport?: string;
  map?: string;
  info?: string;
  notes?: string;
};

type TripDay = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  items: TripItem[];
};

const STORAGE_KEY = 'nyc-trip-checks';

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const tripDays: TripDay[] = [
  {
    id: 'day1',
    tabLabel: 'Jour 1',
    title: 'Arrivée',
    subtitle: 'Installation + Times Square',
    items: [
      { id: 'a1', title: 'Arrivée NYC' },
      { id: 'a2', title: 'Check-in hôtel' },
      { id: 'a3', title: 'Balade Times Square' },
    ],
  },
  {
    id: 'day2',
    tabLabel: 'Jour 2',
    title: 'Midtown',
    subtitle: 'Top of the Rock + Broadway',
    items: [
      { id: 'b1', title: 'Top of the Rock' },
      { id: 'b2', title: 'Central Park' },
    ],
  },
];

function loadChecks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function Page() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0].id);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [supabaseDebug, setSupabaseDebug] = useState('test en cours...');

  useEffect(() => {
    setChecks(loadChecks());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  }, [checks, ready]);

  // 🔥 TEST SUPABASE
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('test_items')
        .select('*')
        .limit(1);

      if (error) {
        setSupabaseDebug(`ERREUR SUPABASE: ${error.message}`);
        return;
      }

      setSupabaseDebug(`SUPABASE OK: ${JSON.stringify(data)}`);
    };

    testConnection();
  }, []);

  const selectedDay = useMemo(
    () => tripDays.find((d) => d.id === selectedDayId) ?? tripDays[0],
    [selectedDayId]
  );

  const toggle = (id: string) => {
    setChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>NYC Trip</h1>

      {/* 🔥 DEBUG SUPABASE */}
      <div style={{ marginTop: 10, color: 'orange', fontWeight: 'bold' }}>
        {supabaseDebug}
      </div>

      <div style={{ marginTop: 20 }}>
        {tripDays.map((day) => (
          <button key={day.id} onClick={() => setSelectedDayId(day.id)}>
            {day.tabLabel}
          </button>
        ))}
      </div>

      <h2>{selectedDay.title}</h2>
      <p>{selectedDay.subtitle}</p>

      {selectedDay.items.map((item) => (
        <div key={item.id}>
          <button onClick={() => toggle(item.id)}>
            {checks[item.id] ? '✅' : '⬜'} {item.title}
          </button>
        </div>
      ))}
    </main>
  );
}