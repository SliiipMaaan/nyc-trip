'use client';

import React, { useEffect, useMemo, useState } from 'react';

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

const STORAGE_KEY = 'nyc-trip-checks-v1';

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const tripDays: TripDay[] = [
  {
    id: 'day0',
    tabLabel: '28 avr',
    title: '28 avril — Arrivée à New York',
    subtitle: 'Arrivée à 22h + check-in Millennium Times Square',
    items: [
      {
        id: '0',
        title: 'Arrivée à New York — 22h',
        transport: 'Vol international',
        notes: 'Arrivée tardive, soirée légère conseillée.',
      },
      {
        id: '0b',
        title: 'Check-in — Millennium Hotel Times Square',
        transport: 'Taxi / Uber conseillé',
        map: maps('Millennium Hotel Broadway Times Square'),
        info: '145 W 44th St, New York, NY 10036',
      },
      {
        id: '0c',
        title: 'Petit tour Times Square',
        transport: 'À pied',
        map: maps('Times Square NYC'),
        notes: 'Balade courte si vous avez encore un peu d’énergie.',
      },
    ],
  },
  {
    id: 'day1',
    tabLabel: '29 avr',
    title: '29 avril — Midtown + Broadway',
    subtitle: 'Tout à pied depuis l’hôtel',
    items: [
      {
        id: '1',
        title: 'Times Square',
        transport: 'À pied',
        map: maps('Times Square NYC'),
      },
      {
        id: '2',
        title: 'Bryant Park',
        transport: 'À pied',
        map: maps('Bryant Park NYC'),
      },
      {
        id: '3',
        title: 'New York Public Library',
        transport: 'À pied',
        map: maps('New York Public Library'),
      },
      {
        id: '4',
        title: 'Grand Central Terminal',
        transport: 'À pied',
        map: maps('Grand Central Terminal'),
      },
      {
        id: '5',
        title: 'Rockefeller Center / Top of the Rock',
        transport: 'À pied',
        map: maps('Top of the Rock NYC'),
        notes: 'Très bon spot avec le CityPASS.',
      },
      {
        id: '6',
        title: 'Ellen’s Stardust Diner',
        transport: 'À pied',
        map: maps("Ellen's Stardust Diner New York"),
        notes: 'Bonne idée avant le spectacle.',
      },
      {
        id: '7',
        title: 'The Lion King — 19h',
        transport: 'À pied',
        map: maps('Minskoff Theatre'),
        notes: 'Spectacle confirmé.',
      },
      {
        id: '8',
        title: 'Option : surveiller & Juliet / Aladdin',
        transport: 'Broadway',
        notes: 'À suivre selon promos, lottery ou TodayTix.',
      },
    ],
  },
  {
    id: 'day2',
    tabLabel: '30 avr',
    title: '30 avril — Hudson Yards / Chelsea',
    subtitle: 'Architecture, balade et vues',
    items: [
      {
        id: '10',
        title: 'Hudson Yards',
        transport: 'Métro ligne 7',
        map: maps('Hudson Yards'),
      },
      {
        id: '11',
        title: 'Vessel',
        transport: 'À pied',
        map: maps('Vessel NYC'),
      },
      {
        id: '12',
        title: 'High Line',
        transport: 'À pied',
        map: maps('High Line NYC'),
      },
      {
        id: '13',
        title: 'Chelsea Market',
        transport: 'À pied',
        map: maps('Chelsea Market NYC'),
      },
      {
        id: '14',
        title: 'Edge',
        transport: 'À pied',
        map: maps('Edge NYC'),
      },
    ],
  },
  {
    id: 'day3',
    tabLabel: '1 mai',
    title: '1 mai — Downtown Manhattan',
    subtitle: 'Quartier Financial District + mémoire',
    items: [
      {
        id: '20',
        title: 'Wall Street',
        transport: 'Métro',
        map: maps('Wall Street NYC'),
      },
      {
        id: '21',
        title: 'Charging Bull',
        transport: 'À pied',
        map: maps('Charging Bull NYC'),
      },
      {
        id: '22',
        title: '9/11 Memorial & Museum',
        transport: 'À pied',
        map: maps('9/11 Memorial Museum New York'),
        notes: 'À faire avec le CityPASS.',
      },
      {
        id: '23',
        title: 'Oculus',
        transport: 'À pied',
        map: maps('Oculus NYC'),
      },
      {
        id: '24',
        title: 'Battery Park',
        transport: 'À pied',
        map: maps('Battery Park New York'),
      },
      {
        id: '25',
        title: 'Pont de Brooklyn / spot photo',
        transport: 'Métro + marche',
        map: maps('Brooklyn Bridge New York'),
      },
    ],
  },
    {
    id: 'day4',
    tabLabel: '2 mai',
    title: '2 mai — Statue of Liberty + Ellis Island',
    subtitle: 'Départ tôt conseillé',
    items: [
      {
        id: '30',
        title: 'Battery Park tôt le matin',
        transport: 'Métro',
        map: maps('Battery Park New York'),
      },
      {
        id: '31',
        title: 'Statue of Liberty',
        transport: 'Ferry',
        map: maps('Statue of Liberty New York'),
      },
      {
        id: '32',
        title: 'Ellis Island',
        transport: 'Ferry',
        map: maps('Ellis Island New York'),
      },
      {
        id: '33',
        title: 'Retour Lower Manhattan',
        transport: 'Ferry + métro',
        notes: 'Après-midi plus tranquille après la visite.',
      },
    ],
  },
  {
    id: 'day5',
    tabLabel: '3 mai',
    title: '3 mai — Central Park / musée / chill',
    subtitle: 'Journée plus flexible',
    items: [
      {
        id: '40',
        title: 'Central Park',
        transport: 'Métro / à pied',
        map: maps('Central Park New York'),
      },
      {
        id: '41',
        title: 'American Museum of Natural History',
        transport: 'À pied / métro',
        map: maps('American Museum of Natural History New York'),
        notes: 'Le musée de Night at the Museum.',
      },
      {
        id: '42',
        title: 'Upper West Side',
        transport: 'À pied',
        map: maps('Upper West Side New York'),
      },
      {
        id: '43',
        title: 'Option shopping / pause / quartier préféré',
        transport: 'Libre',
      },
    ],
  },
  {
    id: 'day6',
    tabLabel: '4 mai',
    title: '4 mai — Dernier jour tranquille',
    subtitle: 'Dernières balades et préparation du départ',
    items: [
      {
        id: '50',
        title: 'Dernière balade Times Square / Midtown',
        transport: 'À pied',
        map: maps('Times Square NYC'),
      },
      {
        id: '51',
        title: 'Bryant Park / pause café',
        transport: 'À pied',
        map: maps('Bryant Park NYC'),
      },
      {
        id: '52',
        title: 'Derniers achats / souvenirs',
        transport: 'À pied',
      },
      {
        id: '53',
        title: 'Préparer les valises',
        transport: 'Hôtel',
      },
    ],
  },
  {
    id: 'day8',
    tabLabel: '5 mai',
    title: '5 mai — Départ vers LAX',
    subtitle: 'Départ du matin avec JetBlue',
    items: [
      {
        id: '100',
        title: 'Check-out hôtel',
        transport: 'Avant départ',
        map: maps('Millennium Hotel Broadway Times Square'),
      },
      {
        id: '101',
        title: 'Départ vers l’aéroport',
        transport: 'Uber conseillé',
        notes: 'Prévoir une bonne marge si vol tôt.',
      },
      {
        id: '102',
        title: 'Vol JetBlue vers LAX',
        transport: 'JetBlue',
        map: 'https://www.jetblue.com/',
      },
    ],
  },
  {
    id: 'day7',
    tabLabel: 'Divers',
    title: 'Divers — Broadway & liens utiles',
    subtitle: 'Raccourcis utiles pendant le séjour',
    items: [
      {
        id: '90',
        title: 'Broadway Direct Lottery',
        transport: 'Lien',
        map: 'https://lottery.broadwaydirect.com/',
      },
      {
        id: '91',
        title: 'TodayTix',
        transport: 'Lien',
        map: 'https://www.todaytix.com/',
      },
      {
        id: '92',
        title: 'TKTS Times Square',
        transport: 'Billets réduits',
        map: maps('TKTS Times Square'),
      },
      {
        id: '93',
        title: 'Lucky Seat',
        transport: 'Lien',
        map: 'https://www.luckyseat.com/',
      },
      {
        id: '94',
        title: 'Google Maps',
        transport: 'Trajets',
        map: 'https://www.google.com/maps',
      },
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
  tabsScroller: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '6px',
    WebkitOverflowScrolling: 'touch',
  } as React.CSSProperties,
  tabButton: {
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '18px',
    minWidth: '96px',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,
  activeTabButton: {
    background: 'rgba(59,130,246,0.30)',
    border: '1px solid rgba(96,165,250,0.5)',
    boxShadow: '0 10px 24px rgba(59,130,246,0.18)',
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

export default function Page() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [activeDayId, setActiveDayId] = useState(tripDays[0].id);

  useEffect(() => {
    const raw =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setChecks(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    }
  }, [checks]);

  const activeDay = tripDays.find((d) => d.id === activeDayId)!;
  const allItems = useMemo(() => tripDays.flatMap((d) => d.items), []);
  const completed = allItems.filter((i) => checks[i.id]).length;
  const progress = Math.round((completed / allItems.length) * 100) || 0;

  const toggle = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
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

          {activeDay.items.map((item) => {
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
          })}
        </section>
      </div>
    </main>
  );
}