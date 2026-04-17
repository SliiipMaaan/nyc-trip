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

const STORAGE_KEY = 'nyc-trip-checks-v-final-2026-04-16';

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const usefulLinks = [
  {
    label: 'Broadway Direct Lottery',
    href: 'https://lottery.broadwaydirect.com/',
    desc: 'Loteries officielles Broadway',
  },
  {
    label: 'TodayTix Rush & Lottery',
    href: 'https://www.todaytix.com/us/static/lotteryandrush',
    desc: 'Rush / lottery / billets de dernière minute',
  },
  {
    label: 'TodayTix NYC Rush Tickets',
    href: 'https://www.todaytix.com/nyc/category/rush-tickets',
    desc: 'Promos et rush tickets à New York',
  },
  {
    label: 'TKTS Times Square',
    href: 'https://www.tdf.org/discount-ticket-programs/tkts-by-tdf/tkts-live/',
    desc: 'Billets à prix réduit le jour même',
  },
];

const tripDays: TripDay[] = [
  {
    id: '2026-04-28',
    tabLabel: '28 avr',
    title: 'Lundi 28 avril — Arrivée à New York',
    subtitle: 'Atterrissage vers 22h • installation à Times Square',
    items: [
      {
        id: 'arrivee-jfk-lga-ewr',
        title: 'Arrivée à New York vers 22h',
        info: 'Prévoir directement le trajet vers Manhattan pour ne pas perdre de temps.',
      },
      {
        id: 'hotel-checkin',
        title: 'Check-in au Millennium Hotel Broadway Times Square',
        transport: 'Taxi / Uber / métro selon arrivée',
        map: maps('Millennium Hotel Broadway Times Square 145 W 44th St New York'),
        info: 'Hôtel très bien placé pour Times Square et Broadway.',
        notes: 'Adresse : 145 W 44th St, New York, NY 10036',
      },
      {
        id: 'petit-tour-night',
        title: 'Petit tour rapide à Times Square si vous avez encore de l’énergie',
        transport: 'À pied',
        map: maps('Times Square New York'),
        info: 'Juste une balade photo, sans gros programme.',
      },
      {
        id: 'dodo',
        title: 'Retour hôtel et repos',
        info: 'Le vrai programme commence le lendemain.',
      },
    ],
  },
  {
    id: '2026-04-29',
    tabLabel: '29 avr',
    title: 'Mardi 29 avril — Midtown + Broadway',
    subtitle: 'Times Square, Top of the Rock, Bryant Park, The Lion King à 19h',
    items: [
      {
        id: 'times-square-matin',
        title: 'Times Square de jour',
        transport: 'À pied',
        map: maps('Times Square New York'),
        info: 'Photos tranquilles le matin pendant que c’est encore gérable.',
      },
      {
        id: 'bryant-park',
        title: 'Bryant Park + New York Public Library (extérieur / intérieur rapide)',
        transport: 'À pied',
        map: maps('Bryant Park New York'),
      },
      {
        id: 'grand-central',
        title: 'Grand Central Terminal',
        transport: 'À pied / métro',
        map: maps('Grand Central Terminal New York'),
        info: 'Rapide et iconique.',
      },
      {
        id: 'top-of-the-rock',
        title: 'Top of the Rock (CityPASS)',
        transport: 'À pied / métro',
        map: maps('Top of the Rock New York'),
        info: 'À faire idéalement fin d’après-midi ou coucher du soleil selon votre réservation.',
      },
      {
        id: 'stardust-diner',
        title: 'Dîner au Ellen’s Stardust Diner',
        transport: 'À pied',
        map: maps("Ellen's Stardust Diner New York"),
        info: 'Mieux vaut y aller tôt ou accepter un peu d’attente.',
      },
      {
        id: 'lion-king',
        title: 'The Lion King à 19h',
        transport: 'À pied',
        map: maps('Minskoff Theatre New York'),
        info: 'Spectacle confirmé.',
        notes: 'Prévoir d’arriver 30 min avant.',
      },
      {
        id: 'juliet-option',
        title: '& Juliet (option)',
        info: 'À garder en bonus si vous voulez ajouter un autre spectacle un autre soir.',
      },
      {
        id: 'aladdin-option',
        title: 'Aladdin (option)',
        info: 'Autre possibilité Broadway si vous trouvez une bonne offre.',
      },
    ],
  },
  {
    id: '2026-04-30',
    tabLabel: '30 avr',
    title: 'Mercredi 30 avril — Lower Manhattan',
    subtitle: '9/11 Memorial, Wall Street, Statue / Battery Park',
    items: [
      {
        id: '911-museum',
        title: '9/11 Memorial / Museum (CityPASS)',
        transport: 'Métro',
        map: maps('9/11 Memorial & Museum New York'),
        info: 'À faire plutôt le matin.',
      },
      {
        id: 'oculus',
        title: 'Oculus',
        transport: 'À pied',
        map: maps('Oculus World Trade Center New York'),
      },
      {
        id: 'wall-street',
        title: 'Wall Street + Charging Bull',
        transport: 'À pied',
        map: maps('Wall Street New York'),
      },
      {
        id: 'battery-park',
        title: 'Battery Park',
        transport: 'À pied',
        map: maps('Battery Park New York'),
      },
      {
        id: 'statue-liberty',
        title: 'Statue of Liberty / Ellis Island (CityPASS selon réservation)',
        transport: 'Ferry',
        map: maps('Battery Park ferry Statue of Liberty New York'),
        info: 'Si ce n’est pas aujourd’hui, intervertir avec un autre jour selon billets.',
      },
      {
        id: 'fin-de-jour-seaport',
        title: 'Option fin de journée : South Street Seaport / Brooklyn Bridge vue',
        transport: 'À pied / métro',
        map: maps('South Street Seaport New York'),
      },
    ],
  },
  {
    id: '2026-05-01',
    tabLabel: '1 mai',
    title: 'Jeudi 1 mai — Central Park + musées',
    subtitle: 'Balade cinéma + musée style “Night at the Museum”',
    items: [
      {
        id: 'central-park',
        title: 'Central Park',
        transport: 'Métro + à pied',
        map: maps('Central Park New York'),
        info: 'Balade tranquille : Bethesda Terrace, Bow Bridge, The Mall.',
      },
      {
        id: 'amnh',
        title: 'American Museum of Natural History',
        transport: 'À pied / métro',
        map: maps('American Museum of Natural History New York'),
        info: 'Le musée “Night at the Museum”.',
      },
      {
        id: 'dakota-strawberry-fields',
        title: 'Option : Dakota Building + Strawberry Fields',
        transport: 'À pied',
        map: maps('Strawberry Fields New York'),
      },
      {
        id: '5th-avenue',
        title: 'Descente vers la 5e Avenue / Midtown selon énergie',
        transport: 'Métro / à pied',
        map: maps('5th Avenue New York'),
      },
    ],
  },
  {
    id: '2026-05-02',
    tabLabel: '2 mai',
    title: 'Vendredi 2 mai — Brooklyn',
    subtitle: 'Pont de Brooklyn, DUMBO, photo Brooklyn 99 si vous voulez',
    items: [
      {
        id: 'brooklyn-bridge',
        title: 'Traversée du Brooklyn Bridge',
        transport: 'Métro + à pied',
        map: maps('Brooklyn Bridge New York'),
        info: 'À faire tôt si possible.',
      },
      {
        id: 'dumbo',
        title: 'DUMBO + Washington Street photo spot',
        transport: 'À pied',
        map: maps('Washington Street Dumbo Brooklyn'),
      },
      {
        id: 'brooklyn-heights',
        title: 'Brooklyn Heights Promenade',
        transport: 'À pied',
        map: maps('Brooklyn Heights Promenade'),
      },
      {
        id: 'brooklyn-99-photo',
        title: 'Photo devant le commissariat “Brooklyn 99” (juste pour la photo)',
        transport: 'Métro',
        map: maps('78th Precinct Brooklyn New York'),
        info: 'Lieu emblématique pour la photo, sans grosse visite.',
      },
      {
        id: 'retour-manhattan',
        title: 'Retour Manhattan en fin de journée',
        transport: 'Métro',
      },
    ],
  },
  {
    id: '2026-05-03',
    tabLabel: '3 mai',
    title: 'Samedi 3 mai — Libre / CityPASS / options',
    subtitle: 'Jour flexible pour compléter ce qui manque',
    items: [
      {
        id: 'citypass-rattrapage',
        title: 'Rattrapage CityPASS',
        info: 'Utiliser ce jour pour ce qui n’a pas pu être fait selon météo / réservations.',
      },
      {
        id: 'summit-option',
        title: 'Option : SUMMIT One Vanderbilt',
        transport: 'Métro / à pied',
        map: maps('SUMMIT One Vanderbilt New York'),
      },
      {
        id: 'chelsea-hudson-yards',
        title: 'Option : Chelsea / Hudson Yards / The Vessel (extérieur)',
        transport: 'Métro / à pied',
        map: maps('Hudson Yards New York'),
      },
      {
        id: 'broadway-deal-hunt',
        title: 'Chercher une promo spectacle du soir',
        info: 'Vérifier Broadway Direct, TodayTix ou TKTS.',
      },
      {
        id: 'shopping-souvenirs',
        title: 'Shopping / souvenirs / repos',
        info: 'Journée volontairement souple.',
      },
    ],
  },
  {
    id: '2026-05-04',
    tabLabel: '4 mai',
    title: 'Dimanche 4 mai — Dernier jour tranquille',
    subtitle: 'Dernières photos, dernières balades, préparer le départ',
    items: [
      {
        id: 'brunch-ou-matin-libre',
        title: 'Matin libre / brunch / dernière balade à Times Square',
        transport: 'À pied',
        map: maps('Times Square New York'),
      },
      {
        id: 'rockfeller-st-patrick',
        title: 'Option : Rockefeller Center / St. Patrick’s Cathedral',
        transport: 'À pied / métro',
        map: maps("St. Patrick's Cathedral New York"),
      },
      {
        id: 'high-line-option',
        title: 'Option : High Line',
        transport: 'Métro',
        map: maps('High Line New York'),
      },
      {
        id: 'preparer-valises',
        title: 'Préparer les valises et vérifier le trajet pour l’aéroport',
        info: 'Comme le départ est tôt, mieux vaut tout anticiper.',
      },
      {
        id: 'derniere-soiree',
        title: 'Dernière soirée calme',
        info: 'Ne pas finir trop tard vu le vol du lendemain matin.',
      },
    ],
  },
  {
    id: '2026-05-05',
    tabLabel: '5 mai',
    title: 'Lundi 5 mai — Départ pour LAX',
    subtitle: 'Départ tôt le matin',
    items: [
      {
        id: 'checkout',
        title: 'Check-out hôtel',
        transport: 'À pied / taxi / Uber',
        map: maps('Millennium Hotel Broadway Times Square 145 W 44th St New York'),
      },
      {
        id: 'airport-transfer',
        title: 'Trajet vers l’aéroport tôt le matin',
        info: 'Prévoir une marge large selon l’aéroport et l’heure du vol.',
      },
      {
        id: 'flight-lax',
        title: 'Vol JetBlue pour LAX',
        info: 'Départ du programme New York.',
      },
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

  useEffect(() => {
    setChecks(loadChecks());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  }, [checks, ready]);
  
    useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('test_items')
        .select('*')
        .limit(1);

      console.log('SUPABASE TEST', { data, error });
    };

    testConnection();
  }, []);

  const selectedDay = useMemo(
    () => tripDays.find((d) => d.id === selectedDayId) ?? tripDays[0],
    [selectedDayId]
  );

  const allItems = useMemo(() => tripDays.flatMap((d) => d.items), []);
  const doneCount = allItems.filter((item) => checks[item.id]).length;
  const totalCount = allItems.length;
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const toggle = (id: string) => {
    setChecks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetAll = () => {
    setChecks({});
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.badge}>VERSION: final-mobile-fix</div>

        <header style={styles.hero}>
          <h1 style={styles.title}>New York Trip Planner</h1>
          <p style={styles.subtitle}>
            28 avril → 5 mai • hôtel Millennium Broadway Times Square
          </p>

          <div style={styles.hotelCard}>
            <div style={styles.hotelTitle}>Hôtel</div>
            <div style={styles.hotelName}>Millennium Hotel Broadway Times Square</div>
            <div style={styles.hotelAddress}>145 W 44th St, New York, NY 10036</div>
            <a
              href={maps('Millennium Hotel Broadway Times Square 145 W 44th St New York')}
              target="_blank"
              rel="noreferrer"
              style={styles.primaryLink}
            >
              Ouvrir l’hôtel dans Google Maps
            </a>
          </div>

          <div style={styles.progressWrap}>
            <div style={styles.progressTopRow}>
              <span style={styles.progressLabel}>Progression</span>
              <span style={styles.progressLabel}>
                {doneCount}/{totalCount} • {percent}%
              </span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${percent}%` }} />
            </div>
          </div>

          <div style={styles.actionRow}>
            <button type="button" onClick={resetAll} style={styles.resetBtn}>
              Réinitialiser les cases
            </button>
          </div>
        </header>

        <section style={styles.tabsSection}>
          <div style={styles.tabsScroller}>
            {tripDays.map((day) => {
              const isActive = day.id === selectedDayId;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDayId(day.id)}
                  style={{
                    ...styles.tabButton,
                    ...(isActive ? styles.tabButtonActive : {}),
                  }}
                >
                  {day.tabLabel}
                </button>
              );
            })}
          </div>
        </section>

        <section style={styles.dayCard}>
          <h2 style={styles.dayTitle}>{selectedDay.title}</h2>
          <p style={styles.daySubtitle}>{selectedDay.subtitle}</p>

          <div style={styles.itemsWrap}>
            {selectedDay.items.map((item, index) => {
              const checked = !!checks[item.id];

              return (
                <div
                  key={item.id}
                  style={{
                    ...styles.itemCard,
                    ...(checked ? styles.itemCardChecked : {}),
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    style={styles.itemButton}
                    aria-pressed={checked}
                  >
                    <div style={styles.itemTopRow}>
                      <div
                        style={{
                          ...styles.checkbox,
                          ...(checked ? styles.checkboxChecked : {}),
                        }}
                      >
                        {checked ? '✓' : ''}
                      </div>
                      <div style={styles.itemMain}>
                        <div style={styles.itemTitleRow}>
                          <span style={styles.itemIndex}>{index + 1}.</span>
                          <span style={styles.itemTitle}>{item.title}</span>
                        </div>

                        {item.transport ? (
                          <div style={styles.itemMeta}>🚇 {item.transport}</div>
                        ) : null}

                        {item.info ? <div style={styles.itemInfo}>{item.info}</div> : null}
                        {item.notes ? <div style={styles.itemNotes}>{item.notes}</div> : null}
                      </div>
                    </div>
                  </button>

                  <div style={styles.itemLinksRow}>
                    {item.map ? (
                      <a
                        href={item.map}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.secondaryLink}
                      >
                        Google Maps
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={styles.linksCard}>
          <h3 style={styles.linksTitle}>Liens utiles</h3>
          <div style={styles.linksGrid}>
            {usefulLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={styles.linkBox}
              >
                <div style={styles.linkBoxTitle}>{link.label}</div>
                <div style={styles.linkBoxDesc}>{link.desc}</div>
              </a>
            ))}
          </div>
        </section>

        <section style={styles.footerNote}>
          <p style={styles.footerText}>
            Astuce mobile : ici les cases et les onglets sont de vrais boutons, donc ça doit
            fonctionner sur téléphone aussi.
          </p>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, #0f172a 0%, #111827 45%, #030712 100%)',
    color: '#ffffff',
    padding: '20px 12px 40px',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: 980,
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    marginBottom: 12,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.5,
    color: '#86efac',
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.35)',
    padding: '6px 10px',
    borderRadius: 999,
  },
  hero: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(28px, 6vw, 44px)',
    lineHeight: 1.05,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
  },
  hotelCard: {
    marginTop: 18,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 14,
  },
  hotelTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#93c5fd',
    fontWeight: 800,
  },
  hotelName: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 800,
  },
  hotelAddress: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  primaryLink: {
    display: 'inline-block',
    marginTop: 10,
    textDecoration: 'none',
    color: '#0f172a',
    background: '#facc15',
    padding: '10px 14px',
    borderRadius: 12,
    fontWeight: 800,
  },
  progressWrap: {
    marginTop: 18,
  },
  progressTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  progressLabel: {
    fontWeight: 700,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #22c55e 0%, #facc15 100%)',
    transition: 'width 0.25s ease',
  },
  actionRow: {
    marginTop: 14,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  resetBtn: {
    border: 'none',
    background: 'rgba(255,255,255,0.10)',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 700,
  },
  tabsSection: {
    marginTop: 18,
  },
  tabsScroller: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    paddingBottom: 4,
    WebkitOverflowScrolling: 'touch',
  },
  tabButton: {
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    borderRadius: 999,
    padding: '12px 16px',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
    minHeight: 44,
  },
  tabButtonActive: {
    background: '#ffffff',
    color: '#111827',
  },
  dayCard: {
    marginTop: 18,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
  },
  dayTitle: {
    margin: 0,
    fontSize: 'clamp(22px, 4.5vw, 30px)',
    fontWeight: 900,
  },
  daySubtitle: {
    marginTop: 8,
    marginBottom: 0,
    color: 'rgba(255,255,255,0.78)',
    fontSize: 15,
  },
  itemsWrap: {
    marginTop: 18,
    display: 'grid',
    gap: 12,
  },
  itemCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 18,
    overflow: 'hidden',
  },
  itemCardChecked: {
    border: '1px solid rgba(34,197,94,0.50)',
    boxShadow: '0 0 0 1px rgba(34,197,94,0.15) inset',
  },
  itemButton: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: 'inherit',
    textAlign: 'left',
    padding: 14,
    cursor: 'pointer',
    touchAction: 'manipulation',
  },
  itemTopRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: 10,
    border: '2px solid rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 16,
    color: '#0b1220',
    background: 'transparent',
  },
  checkboxChecked: {
    background: '#22c55e',
    border: '2px solid #22c55e',
  },
  itemMain: {
    flex: 1,
    minWidth: 0,
  },
  itemTitleRow: {
    display: 'flex',
    gap: 6,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  itemIndex: {
    opacity: 0.7,
    fontWeight: 800,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.35,
  },
  itemMeta: {
    marginTop: 6,
    fontSize: 14,
    color: '#93c5fd',
    fontWeight: 700,
  },
  itemInfo: {
    marginTop: 8,
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 1.5,
  },
  itemNotes: {
    marginTop: 6,
    fontSize: 13,
    color: '#fcd34d',
    lineHeight: 1.45,
  },
  itemLinksRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    padding: '0 14px 14px 54px',
  },
  secondaryLink: {
    display: 'inline-block',
    textDecoration: 'none',
    color: '#fff',
    background: 'rgba(59,130,246,0.18)',
    border: '1px solid rgba(59,130,246,0.35)',
    padding: '8px 12px',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 14,
  },
  linksCard: {
    marginTop: 18,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 24,
    padding: 18,
  },
  linksTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },
  linksGrid: {
    marginTop: 14,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
  },
  linkBox: {
    textDecoration: 'none',
    color: '#fff',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 14,
  },
  linkBoxTitle: {
    fontWeight: 800,
    fontSize: 15,
  },
  linkBoxDesc: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    lineHeight: 1.45,
  },
  footerNote: {
    marginTop: 16,
    textAlign: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    margin: 0,
  },
};