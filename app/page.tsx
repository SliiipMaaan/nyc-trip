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

  // 🔥 TEST SUPABASE (version propre)
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

  const allItems = useMemo(() => tripDays.flatMap((d) => d.items), []);
  const doneCount = allItems.filter((item) => checks[item.id]).length;
  const totalCount = allItems.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

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

          {/* 🔥 DEBUG SUPABASE */}
          <div style={{ marginTop: 10, color: '#facc15', fontWeight: 700 }}>
            {supabaseDebug}
          </div>

          <div style={styles.hotelCard}>
            <div style={styles.hotelTitle}>Hôtel</div>
            <div style={styles.hotelName}>
              Millennium Hotel Broadway Times Square
            </div>
            <div style={styles.hotelAddress}>
              145 W 44th St, New York, NY 10036
            </div>
            <a
              href={maps(
                'Millennium Hotel Broadway Times Square 145 W 44th St New York'
              )}
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
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${percent}%`,
                }}
              />
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
                          <span style={styles.itemIndex}>
                            {index + 1}.
                          </span>
                          <span style={styles.itemTitle}>
                            {item.title}
                          </span>
                        </div>

                        {item.transport && (
                          <div style={styles.itemMeta}>
                            🚇 {item.transport}
                          </div>
                        )}

                        {item.info && (
                          <div style={styles.itemInfo}>
                            {item.info}
                          </div>
                        )}

                        {item.notes && (
                          <div style={styles.itemNotes}>
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  <div style={styles.itemLinksRow}>
                    {item.map && (
                      <a
                        href={item.map}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.secondaryLink}
                      >
                        Google Maps
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}