'use client';

import { supabase } from '@/lib/supabase';
import React, { useEffect, useMemo, useState } from 'react';

type TripItem = {
  id: string;
  title: string;
};

type TripDay = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  items: TripItem[];
};

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

export default function Page() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0].id);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [supabaseDebug, setSupabaseDebug] = useState('chargement...');

  // 🔥 LOAD depuis Supabase
  useEffect(() => {
    const loadChecksFromSupabase = async () => {
      const { data, error } = await supabase
        .from('trip_checks')
        .select('item_id, checked');

      if (error) {
        setSupabaseDebug(`ERREUR LOAD: ${error.message}`);
        setReady(true);
        return;
      }

      const mapped: Record<string, boolean> = {};

      for (const row of data ?? []) {
        mapped[row.item_id] = row.checked;
      }

      setChecks(mapped);
      setSupabaseDebug('SUPABASE CHECKS OK');
      setReady(true);
    };

    loadChecksFromSupabase();
  }, []);

  const selectedDay = useMemo(
    () => tripDays.find((d) => d.id === selectedDayId) ?? tripDays[0],
    [selectedDayId]
  );

  // 🔥 SAVE dans Supabase
  const toggle = async (id: string) => {
    const newValue = !checks[id];

    setChecks((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    const { error } = await supabase
      .from('trip_checks')
      .upsert(
        {
          item_id: id,
          checked: newValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'item_id' }
      );

    if (error) {
      setSupabaseDebug(`ERREUR SAVE: ${error.message}`);
      return;
    }

    setSupabaseDebug(`SAUVEGARDE OK: ${id} = ${newValue}`);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>NYC Trip</h1>

      {/* DEBUG */}
      <div style={{ marginTop: 10, color: 'orange', fontWeight: 'bold' }}>
        {supabaseDebug}
      </div>

      {/* TABS */}
      <div style={{ marginTop: 20 }}>
        {tripDays.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDayId(day.id)}
            style={{ marginRight: 10 }}
          >
            {day.tabLabel}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      <h2>{selectedDay.title}</h2>
      <p>{selectedDay.subtitle}</p>

      {/* CHECKLIST */}
      {selectedDay.items.map((item) => (
        <div key={item.id} style={{ marginBottom: 10 }}>
          <button onClick={() => toggle(item.id)}>
            {checks[item.id] ? '✅' : '⬜'} {item.title}
          </button>
        </div>
      ))}
    </main>
  );
}