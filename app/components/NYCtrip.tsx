'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type TripItem = {
  id: string;
  title: string;
  transport: string;
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

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const tripDays: TripDay[] = [
  {
    id: 'day0',
    tabLabel: '28 avr',
    title: '28 avril — Arrivée à New York',
    subtitle: 'Arrivée à 22h + check-in Millennium Times Square',
    items: [
      { id: '0', title: '22:00 — Arrivée à New York', transport: 'Vol international' },
      { id: '0b', title: '23:00 — Check-in hôtel', transport: 'Taxi / Uber', map: maps('Millennium Hotel Broadway Times Square') },
      { id: '0c', title: '23:30 — Times Square rapide', transport: 'À pied', map: maps('Times Square NYC') },
    ],
  },
  {
    id: 'day1',
    tabLabel: '29 avr',
    title: '29 avril — Midtown + Broadway',
    subtitle: 'Départ 08:30 — 100% à pied',
    items: [
      { id: '1', title: '08:30 — Départ hôtel', transport: 'À pied' },
      { id: '2', title: 'Times Square', transport: 'À pied', map: maps('Times Square NYC') },
      { id: '3', title: 'Bryant Park', transport: 'À pied', map: maps('Bryant Park NYC') },
      { id: '4', title: 'NY Public Library', transport: 'À pied', map: maps('New York Public Library') },
      { id: '5', title: '5th Avenue + St Patrick', transport: 'À pied', map: maps("St Patrick Cathedral NYC") },
      { id: '6', title: 'Rockefeller Center', transport: 'À pied', map: maps('Rockefeller Center NYC') },
      { id: '7', title: '12:15 — Déjeuner', transport: 'À pied' },
      { id: '8', title: '13:30 — Empire State Building', transport: 'À pied', map: maps('Empire State Building NYC') },
      { id: '9', title: '15:10 — Top of the Rock', transport: 'À pied', map: maps('Top of the Rock NYC') },
      { id: '10', title: '16:45 — Grand Central', transport: 'À pied', map: maps('Grand Central Terminal') },
      { id: '11', title: '17:45 — Stardust Diner', transport: 'À pied', map: maps("Ellen's Stardust Diner") },
      { id: '12', title: '19:00 — Lion King', transport: 'À pied', map: maps('Minskoff Theatre') },
    ],
  },
  {
    id: 'day2',
    tabLabel: '30 avr',
    title: '30 avril — Statue + Downtown',
    subtitle: 'Départ 07:30',
    items: [
      { id: '20', title: '07:30 — Départ hôtel', transport: 'Métro ligne 1 → South Ferry' },
      { id: '21', title: '08:15 — Battery Park', transport: 'À pied', map: maps('Battery Park NYC') },
      { id: '22', title: '08:30 — Statue of Liberty', transport: 'Ferry', map: maps('Statue of Liberty NYC') },
      { id: '23', title: '10:30 — Ellis Island', transport: 'Ferry', map: maps('Ellis Island NYC') },
      { id: '24', title: '13:30 — Déjeuner', transport: 'À pied' },
      { id: '25', title: '14:00 — Wall Street', transport: 'À pied', map: maps('Wall Street NYC') },
      { id: '26', title: '14:30 — 9/11 Museum', transport: 'À pied', map: maps('9/11 Memorial NYC') },
      { id: '27', title: '17:30 — Retour hôtel', transport: 'Métro' },
    ],
  },
  {
    id: 'day3',
    tabLabel: '1 mai',
    title: '1 mai — Brooklyn + Sunrise',
    subtitle: 'Lever de soleil + journée Brooklyn',
    items: [
      { id: '30', title: '05:15 — Départ hôtel', transport: 'Métro vers Brooklyn', map: maps('DUMBO Brooklyn NYC') },
      { id: '31', title: '05:50 — Arrivée DUMBO', transport: 'À pied' },
      { id: '32', title: '06:00 — Sunrise (DUMBO / Brooklyn Bridge Park)', transport: 'À pied', notes: 'Moment clé du voyage 🔥' },
      { id: '33', title: '07:15 — Brooklyn Bridge', transport: 'À pied', map: maps('Brooklyn Bridge NYC') },
      { id: '34', title: '08:30 — Petit déjeuner', transport: 'À pied' },
      { id: '35', title: '10:00 — DUMBO', transport: 'À pied', map: maps('DUMBO Brooklyn') },
      { id: '36', title: '11:30 — Brooklyn Bridge Park', transport: 'À pied', map: maps('Brooklyn Bridge Park') },
      { id: '37', title: '15:30 — Williamsburg', transport: 'Métro', map: maps('Williamsburg Brooklyn') },
      { id: '38', title: '18:30 — Retour hôtel', transport: 'Métro' },
    ],
  },
  {
    id: 'day4',
    tabLabel: '2 mai',
    title: '2 mai — Central Park + Museum',
    subtitle: 'Départ 08:30',
    items: [
      { id: '40', title: '08:30 — Départ hôtel', transport: 'Métro → Central Park' },
      { id: '41', title: '09:00 — Central Park', transport: 'À pied', map: maps('Central Park NYC') },
      { id: '42', title: '13:00 — Déjeuner', transport: 'À pied' },
      { id: '43', title: '14:00 — Museum of Natural History', transport: 'À pied', map: maps('American Museum of Natural History') },
      { id: '44', title: '17:30 — Option Roosevelt Island', transport: 'Métro', map: maps('Roosevelt Island Tramway') },
    ],
  },
  {
    id: 'day5',
    tabLabel: '3 mai',
    title: '3 mai — High Line + Hudson',
    subtitle: 'Départ 09:00',
    items: [
      { id: '50', title: '09:00 — Départ hôtel', transport: 'Métro → 14 St' },
      { id: '51', title: '09:30 — High Line', transport: 'À pied', map: maps('High Line NYC') },
      { id: '52', title: '12:00 — Chelsea Market', transport: 'À pied', map: maps('Chelsea Market NYC') },
      { id: '53', title: '14:00 — Hudson Yards', transport: 'À pied', map: maps('Hudson Yards') },
      { id: '54', title: '15:00 — Edge (option)', transport: 'À pied', map: maps('Edge NYC') },
    ],
  },
  {
    id: 'day6',
    tabLabel: '4 mai',
    title: '4 mai — SoHo + quartiers',
    subtitle: 'Départ 09:00',
    items: [
      { id: '60', title: '09:00 — Départ hôtel', transport: 'Métro → Canal St' },
      { id: '61', title: 'SoHo', transport: 'À pied', map: maps('SoHo NYC') },
      { id: '62', title: 'Little Italy', transport: 'À pied', map: maps('Little Italy NYC') },
      { id: '63', title: 'Chinatown', transport: 'À pied', map: maps('Chinatown NYC') },
      { id: '64', title: 'Washington Square Park', transport: 'À pied', map: maps('Washington Square Park') },
    ],
  },
  {
    id: 'day8',
    tabLabel: '5 mai',
    title: '5 mai — Départ LAX',
    subtitle: 'Départ matin',
    items: [
      { id: '100', title: '06:00 — Check-out', transport: 'Hôtel' },
      { id: '101', title: '06:30 — Aéroport', transport: 'Uber' },
    ],
  },
  {
    id: 'day7',
    tabLabel: 'Divers',
    title: 'Divers — Liens utiles',
    subtitle: 'Broadway + Ferry',
    items: [
      { id: '90', title: 'Broadway Lottery', transport: 'Lien', map: 'https://lottery.broadwaydirect.com/' },
      { id: '91', title: 'TodayTix', transport: 'Lien', map: 'https://www.todaytix.com/' },
      { id: '92', title: 'TKTS Times Square', transport: 'Billets', map: maps('TKTS Times Square') },
      { id: '93', title: 'NYC Ferry (Sunset / Night)', transport: 'East River Route', map: maps('Wall St Pier 11 NYC'), notes: 'Faire Wall St → East 34th St vers sunset ou nuit 🔥 (4.50$)' },
    ],
  },
  {
  id: 'day9',
  tabLabel: 'Restos',
  title: 'Restos à faire',
  subtitle: 'Checklist food pendant le voyage',
  items: [
    {
      id: 'r1',
      title: 'Los Tacos No.1 (tacos) — Midtown',
      transport: 'À pied',
      map: maps('Los Tacos No.1 Times Square'),
    },
    {
      id: 'r2',
      title: '7th Street Burger (burger smash) — Midtown',
      transport: 'À pied',
      map: maps('7th Street Burger NYC'),
    },
    {
      id: 'r3',
      title: 'Shake Shack (burger) — Midtown',
      transport: 'À pied',
      map: maps('Shake Shack Times Square'),
    },
    {
      id: 'r4',
      title: 'Joe’s Pizza (pizza) — Manhattan',
      transport: 'À pied',
      map: maps('Joes Pizza NYC'),
    },
    {
      id: 'r5',
      title: 'Levain Bakery (cookies) — Upper West Side',
      transport: 'À pied',
      map: maps('Levain Bakery NYC'),
    },
    {
      id: 'r6',
      title: 'Cafe Panna (glaces) — Gramercy',
      transport: 'À pied',
      map: maps('Cafe Panna NYC'),
    },
    {
      id: 'r7',
      title: 'Junior’s (cheesecake) — Times Square',
      transport: 'À pied',
      map: maps('Juniors Restaurant NYC'),
    },
    {
      id: 'r8',
      title: 'Raising Cane’s (fried chicken) — Midtown',
      transport: 'À pied',
      map: maps('Raising Canes NYC'),
    },
    {
      id: 'r9',
      title: 'Lenwich (sandwich) — Manhattan',
      transport: 'À pied',
      map: maps('Lenwich NYC'),
    }
  ],
},
];

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #0b1220 0%, #111827 35%, #0f172a 100%)',
    color: '#ffffff',
    padding: '16px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  } as React.CSSProperties,
  container: {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    paddingBottom: '32px',
  } as React.CSSProperties,
  hero: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '18px',
    background:
      'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(236,72,153,0.16), rgba(251,191,36,0.10))',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    marginBottom: '16px',
  } as React.CSSProperties,
  progressCard: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    marginBottom: '16px',
  } as React.CSSProperties,
  sectionCard: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    marginBottom: '16px',
  } as React.CSSProperties,
  itemCard: {
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '14px',
    background: 'rgba(0,0,0,0.18)',
    marginBottom: '10px',
  } as React.CSSProperties,
  itemTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  } as React.CSSProperties,
  checkbox: {
    width: '24px',
    height: '24px',
    marginTop: '2px',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,
  linkButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40px',
    padding: '9px 12px',
    borderRadius: '12px',
    background: '#ffffff',
    color: '#111827',
    fontSize: '13px',
    fontWeight: 700,
    textDecoration: 'none',
  } as React.CSSProperties,
};

export default function NYCtrip() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [activeDayId, setActiveDayId] = useState(tripDays[0].id);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadChecks = async () => {
      const { data, error } = await supabase
        .from('trip_checks')
        .select('item_id, checked');

      if (error) {
        console.error('Erreur chargement trip_checks:', error);
        if (mounted) setIsLoaded(true);
        return;
      }

      if (!mounted) return;

      const nextChecks: Record<string, boolean> = {};
      for (const row of data ?? []) {
        nextChecks[row.item_id] = !!row.checked;
      }

      setChecks(nextChecks);
      setIsLoaded(true);
    };

    loadChecks();

    const channel = supabase
      .channel('trip_checks_page_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_checks',
        },
        (payload) => {
          const row = payload.new as { item_id?: string; checked?: boolean } | null;
          if (!row?.item_id) return;

          setChecks((prev) => ({
            ...prev,
            [row.item_id as string]: !!row.checked,
          }));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const activeDay = tripDays.find((d) => d.id === activeDayId)!;
  const allItems = useMemo(() => tripDays.flatMap((d) => d.items), []);
  const completed = allItems.filter((i) => checks[i.id]).length;
  const progress = Math.round((completed / allItems.length) * 100) || 0;

  const toggle = async (id: string) => {
    const previous = !!checks[id];
    const nextValue = !previous;

    setChecks((prev) => ({ ...prev, [id]: nextValue }));

    const { error } = await supabase.from('trip_checks').upsert(
      {
        item_id: id,
        checked: nextValue,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'item_id',
      }
    );

    if (error) {
      console.error('Erreur update trip_checks:', error);
      setChecks((prev) => ({ ...prev, [id]: previous }));
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>NYC Trip</h1>
          <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.78)', fontSize: 14 }}>
            App mobile-first — 28 avril au 5 mai — checklist + dates + Google Maps
          </div>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              gridTemplateColumns: '1fr 1fr',
              marginTop: '14px',
            }}
          >
            <div
              style={{
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '18px',
                padding: '12px',
                background: 'rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>Arrivée</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>28 avril · 22h</div>
              <div style={{ fontSize: 13, marginTop: 2, color: 'rgba(255,255,255,0.74)' }}>
                Millennium Times Square
              </div>
            </div>

            <div
              style={{
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '18px',
                padding: '12px',
                background: 'rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>Départ</div>
              <div style={{ fontWeight: 700, marginTop: 4 }}>5 mai · matin</div>
              <div style={{ fontSize: 13, marginTop: 2, color: 'rgba(255,255,255,0.74)' }}>
                JetBlue vers LAX
              </div>
            </div>
          </div>
        </section>

        <section style={styles.progressCard}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Progression</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', marginTop: 2 }}>
                {completed}/{allItems.length} étapes cochées
              </div>
            </div>

            <div style={{ fontSize: 20, fontWeight: 800 }}>{progress}%</div>
          </div>

          <div
            style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '8px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #60a5fa, #34d399)',
                borderRadius: '999px',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </section>

        <section style={styles.sectionCard}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Dates</div>

          <div style={{ marginBottom: 12 }}>
            <select
              value={activeDayId}
              onChange={(e) => setActiveDayId(e.target.value)}
              style={{
                width: '100%',
                minHeight: 46,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                padding: '10px 12px',
                fontSize: 16,
                outline: 'none',
              }}
            >
              {tripDays.map((d) => (
                <option key={d.id} value={d.id} style={{ color: '#000' }}>
                  {d.tabLabel} — {d.title}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section style={styles.sectionCard}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Programme
          </div>

          <h2 style={{ margin: '6px 0 4px 0', fontSize: 24 }}>{activeDay.title}</h2>

          <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14, marginBottom: 14 }}>
            {activeDay.subtitle}
          </div>

          {!isLoaded ? (
            <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14 }}>
              Chargement des cases...
            </div>
          ) : (
            activeDay.items.map((item) => {
              const done = !!checks[item.id];

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.itemCard,
                    opacity: done ? 0.82 : 1,
                    border: done
                      ? '1px solid rgba(52,211,153,0.35)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: done
                      ? 'rgba(16,185,129,0.10)'
                      : 'rgba(0,0,0,0.18)',
                  }}
                >
                  <div style={styles.itemTop}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(item.id)}
                      style={styles.checkbox}
                    />

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          lineHeight: 1.35,
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {item.title}
                      </div>

                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.72)',
                          marginTop: '4px',
                        }}
                      >
                        {item.transport}
                      </div>

                      {item.info ? (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.62)',
                            marginTop: '6px',
                          }}
                        >
                          {item.info}
                        </div>
                      ) : null}

                      {item.notes ? (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.62)',
                            marginTop: '6px',
                          }}
                        >
                          {item.notes}
                        </div>
                      ) : null}

                      {item.map ? (
                        <div style={{ marginTop: '10px' }}>
                          <a
                            href={item.map}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.linkButton}
                          >
                            Ouvrir Maps
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
