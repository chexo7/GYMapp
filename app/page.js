'use client';

import { useMemo, useState } from 'react';

const PROFILES = [
  { id: 'sergio', name: 'Sergio' },
  { id: 'scarlett', name: 'Scarlett' },
];

const BASE_SEASONS = [
  {
    id: 'fuerza-1-sergio',
    profileId: 'sergio',
    title: 'Fuerza 1',
    active: true,
    sequence: ['upper1', 'lower1', 'swim1'],
    workouts: {
      upper1: {
        id: 'upper1',
        name: 'Upper 1',
        items: [
          { id: 'bench', type: 'strength', title: 'Bench Press', sets: 3, reps: '8-12' },
          { id: 'row', type: 'strength', title: 'Row', sets: 3, reps: '8-12' },
          { id: 'cardio', type: 'cardio', title: 'Treadmill', target: 'Opcional' },
          { id: 'sauna', type: 'sauna', title: 'Sauna', target: 'Opcional' },
        ],
      },
      lower1: {
        id: 'lower1',
        name: 'Lower 1',
        items: [
          { id: 'squat', type: 'strength', title: 'Back Squat', sets: 3, reps: '8-12' },
          { id: 'rdl', type: 'strength', title: 'RDL', sets: 3, reps: '8-12' },
          { id: 'bike', type: 'cardio', title: 'Bike', target: 'Opcional' },
          { id: 'sauna', type: 'sauna', title: 'Sauna', target: 'Opcional' },
        ],
      },
      swim1: {
        id: 'swim1',
        name: 'Swim 1',
        items: [
          { id: 'swim', type: 'swim', title: 'Swim', target: 'Opcional' },
          { id: 'sauna', type: 'sauna', title: 'Sauna', target: 'Opcional' },
        ],
      },
    },
  },
  {
    id: 'base-nov-scarlett',
    profileId: 'scarlett',
    title: 'Base Noviembre',
    active: true,
    sequence: ['upper1', 'lower1', 'swim1'],
    workouts: {
      upper1: {
        id: 'upper1',
        name: 'Upper 1',
        items: [
          { id: 'bench', type: 'strength', title: 'Bench Press', sets: 3, reps: '8-12' },
          { id: 'row', type: 'strength', title: 'Row', sets: 3, reps: '8-12' },
          { id: 'cardio', type: 'cardio', title: 'Treadmill', target: 'Opcional' },
        ],
      },
      lower1: {
        id: 'lower1',
        name: 'Lower 1',
        items: [
          { id: 'lunge', type: 'strength', title: 'Lunges', sets: 3, reps: '10-12' },
          { id: 'deadlift', type: 'strength', title: 'Deadlift', sets: 3, reps: '6-8' },
          { id: 'bike', type: 'cardio', title: 'Bike', target: 'Opcional' },
        ],
      },
      swim1: {
        id: 'swim1',
        name: 'Swim 1',
        items: [
          { id: 'swim', type: 'swim', title: 'Swim', target: 'Opcional' },
          { id: 'sauna', type: 'sauna', title: 'Sauna', target: 'Opcional' },
        ],
      },
    },
  },
];

const initialLogs = [
  { id: '1', profileId: 'sergio', seasonId: 'fuerza-1-sergio', workoutId: 'upper1', date: Date.now() - 86400000 * 2 },
  { id: '2', profileId: 'sergio', seasonId: 'fuerza-1-sergio', workoutId: 'lower1', date: Date.now() - 86400000 * 4 },
  { id: '3', profileId: 'scarlett', seasonId: 'base-nov-scarlett', workoutId: 'swim1', date: Date.now() - 86400000 * 1 },
];

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('es-MX', {
    month: 'short',
    day: 'numeric',
  });
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileId, setProfileId] = useState(PROFILES[0].id);
  const [view, setView] = useState('today');
  const [seasons, setSeasons] = useState(BASE_SEASONS);
  const [activeSession, setActiveSession] = useState(null);
  const [logs, setLogs] = useState(initialLogs);
  const [progress, setProgress] = useState({});
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);

  const profile = PROFILES.find((p) => p.id === profileId);
  const profileSeasons = useMemo(
    () => seasons.filter((season) => season.profileId === profileId),
    [seasons, profileId],
  );

  const activeSeason = useMemo(
    () => profileSeasons.find((season) => season.active) || null,
    [profileSeasons],
  );

  const currentProgress = progress[profileId];

  const nextWorkout = useMemo(() => {
    if (!activeSeason) return null;
    const lastWorkoutId = currentProgress?.lastWorkoutId;
    const sequence = activeSeason.sequence;
    if (!lastWorkoutId) return activeSeason.workouts[sequence[0]];
    const idx = sequence.indexOf(lastWorkoutId);
    const nextIdx = idx === -1 ? 0 : (idx + 1) % sequence.length;
    return activeSeason.workouts[sequence[nextIdx]];
  }, [activeSeason, currentProgress]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleStartSession = () => {
    if (!activeSeason || !nextWorkout) return;
    const sessionPayload = {
      id: `session-${Date.now()}`,
      profileId,
      seasonId: activeSeason.id,
      workoutId: nextWorkout.id,
      startedAt: Date.now(),
      entries: {},
    };
    setActiveSession(sessionPayload);
    setView('session');
  };

  const handleFinishSession = () => {
    if (!activeSession) return;
    const newLog = {
      id: `log-${Date.now()}`,
      profileId: activeSession.profileId,
      seasonId: activeSession.seasonId,
      workoutId: activeSession.workoutId,
      date: Date.now(),
    };

    setLogs((prev) => [newLog, ...prev]);
    setProgress((prev) => ({
      ...prev,
      [activeSession.profileId]: {
        lastWorkoutId: activeSession.workoutId,
        lastSessionId: newLog.id,
      },
    }));
    setActiveSession(null);
    setView('today');
  };

  const updateStrengthSet = (itemId, setIndex, field, value) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const itemSets = prev.entries[itemId] || [];
      const updated = [...itemSets];
      updated[setIndex] = { ...updated[setIndex], [field]: value };
      return { ...prev, entries: { ...prev.entries, [itemId]: updated } };
    });
  };

  const updateCardioEntry = (itemId, field, value) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const updated = { ...(prev.entries[itemId] || {}) };
      updated[field] = value;
      return { ...prev, entries: { ...prev.entries, [itemId]: updated } };
    });
  };

  const handleCreateSeason = () => {
    const newSeason = {
      id: `nueva-${Date.now()}`,
      profileId,
      title: `Temporada ${profileSeasons.length + 1}`,
      active: profileSeasons.length === 0,
      sequence: ['upper1', 'lower1', 'swim1'],
      workouts: {
        upper1: { id: 'upper1', name: 'Upper 1', items: [] },
        lower1: { id: 'lower1', name: 'Lower 1', items: [] },
        swim1: { id: 'swim1', name: 'Swim 1', items: [] },
      },
    };
    setSeasons((prev) => [...prev, newSeason]);
    setSelectedSeasonId(newSeason.id);
  };

  const handleActivateSeason = (seasonId) => {
    setSeasons((prev) =>
      prev.map((season) =>
        season.profileId === profileId
          ? { ...season, active: season.id === seasonId }
          : season,
      ),
    );
  };

  const renderLogin = () => (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0B0E14] px-6">
      <div className="w-full max-w-md bg-[#151921] border border-[#2D3340] rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Login compartido</p>
          <h1 className="text-2xl font-bold">GYM app</h1>
          <p className="text-sm text-slate-400">Un solo login, perfiles para Sergio y Scarlett.</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-rose-600 hover:bg-rose-500 transition text-white font-bold py-3 rounded-2xl"
        >
          Entrar
        </button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <header className="sticky top-0 z-30 px-4 pt-6 pb-3 bg-[#0B0E14] flex items-center justify-between border-b border-[#151921]">
      <div>
        <p className="text-[11px] uppercase text-slate-500 font-semibold">Perfil</p>
        <select
          className="bg-[#151921] border border-[#2D3340] rounded-xl px-3 py-2 text-sm font-semibold text-white"
          value={profileId}
          onChange={(e) => {
            setProfileId(e.target.value);
            setSelectedSeasonId(null);
          }}
        >
          {PROFILES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="text-right">
        <p className="text-[11px] uppercase text-slate-500 font-semibold">Temporada activa</p>
        <p className="text-sm font-bold">{activeSeason ? activeSeason.title : 'Ninguna'}</p>
        {activeSeason && (
          <p className="text-[11px] text-slate-500">Orden B2: {activeSeason.sequence.join(' › ')}</p>
        )}
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="w-full min-h-full pb-28">
      {renderHeader()}
      <section className="px-4 pt-4 space-y-3">
        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
          <p className="text-xs text-slate-500 font-semibold">Siguiente workout</p>
          <h2 className="text-xl font-bold mt-1">{nextWorkout ? nextWorkout.name : 'Activa una temporada'}</h2>
          {nextWorkout && (
            <p className="text-sm text-slate-400">B2 loop según último hecho</p>
          )}
        </div>

        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Items de hoy</h3>
            <p className="text-xs text-slate-500">Ver solo lo esencial</p>
          </div>
          {!nextWorkout && (
            <p className="text-sm text-slate-500">Activa o crea una temporada para continuar.</p>
          )}
          {nextWorkout?.items.map((item, index) => (
            <div key={item.id} className="py-2 border-t border-[#2D3340] first:border-t-0">
              <p className="font-semibold">{index + 1}) {item.title}</p>
              {item.type === 'strength' && (
                <p className="text-sm text-slate-400">{item.sets} sets, {item.reps} reps</p>
              )}
              {item.type !== 'strength' && (
                <p className="text-sm text-slate-400">
                  {item.type === 'cardio' && 'Cardio'}
                  {item.type === 'swim' && 'Swim'}
                  {item.type === 'sauna' && 'Sauna'}: {item.target}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-16 left-0 w-full px-4 safe-pb">
        <button
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50"
          disabled={!nextWorkout}
          onClick={handleStartSession}
        >
          EMPEZAR SESIÓN
        </button>
      </div>
    </div>
  );

  const renderSession = () => {
    if (!activeSession || !activeSeason) return null;
    const workout = activeSeason.workouts[activeSession.workoutId];

    return (
      <div className="w-full min-h-full pb-28">
        <div className="sticky top-0 bg-[#0B0E14] px-4 pt-6 pb-4 border-b border-[#151921]">
          <p className="text-xs text-slate-500">Sesión en curso</p>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{workout.name}</h2>
            <span className="text-sm text-slate-400">Perfil: {profile.name}</span>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {workout.items.map((item) => (
            <div key={item.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{item.title}</h3>
                {item.type === 'strength' && (
                  <p className="text-xs text-slate-500">
                    {item.sets} x {item.reps}
                  </p>
                )}
              </div>

              {item.type === 'strength' && (
                <div className="space-y-2">
                  {Array.from({ length: item.sets }).map((_, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                        placeholder="lb"
                        value={activeSession.entries[item.id]?.[idx]?.weight || ''}
                        onChange={(e) => updateStrengthSet(item.id, idx, 'weight', e.target.value)}
                      />
                      <input
                        className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                        placeholder="reps"
                        value={activeSession.entries[item.id]?.[idx]?.reps || ''}
                        onChange={(e) => updateStrengthSet(item.id, idx, 'reps', e.target.value)}
                      />
                    </div>
                  ))}
                  <button
                    className="text-sm text-rose-400 font-semibold"
                    onClick={() =>
                      updateStrengthSet(item.id, (activeSession.entries[item.id]?.length || item.sets) , 'weight', '')
                    }
                  >
                    + Agregar set
                  </button>
                </div>
              )}

              {item.type === 'cardio' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                      placeholder="Minutos"
                      value={activeSession.entries[item.id]?.minutes || ''}
                      onChange={(e) => updateCardioEntry(item.id, 'minutes', e.target.value)}
                    />
                    <input
                      className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                      placeholder="Notas"
                      value={activeSession.entries[item.id]?.notes || ''}
                      onChange={(e) => updateCardioEntry(item.id, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {item.type === 'swim' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                      placeholder="Distancia"
                      value={activeSession.entries[item.id]?.distance || ''}
                      onChange={(e) => updateCardioEntry(item.id, 'distance', e.target.value)}
                    />
                    <input
                      className="flex-1 bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                      placeholder="Minutos"
                      value={activeSession.entries[item.id]?.minutes || ''}
                      onChange={(e) => updateCardioEntry(item.id, 'minutes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {item.type === 'sauna' && (
                <div className="space-y-2">
                  <input
                    className="w-full bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                    placeholder="Minutos"
                    value={activeSession.entries[item.id]?.minutes || ''}
                    onChange={(e) => updateCardioEntry(item.id, 'minutes', e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-16 left-0 w-full px-4 safe-pb">
          <button
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg"
            onClick={handleFinishSession}
          >
            TERMINAR Y GUARDAR
          </button>
        </div>
      </div>
    );
  };

  const renderSeasons = () => (
    <div className="w-full min-h-full pb-24">
      {renderHeader()}
      <section className="px-4 pt-4 space-y-4">
        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Temporadas</h2>
            <button
              className="text-rose-400 font-semibold text-sm"
              onClick={handleCreateSeason}
            >
              + Crear temporada
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {profileSeasons.map((season) => (
              <div
                key={season.id}
                className="flex items-start justify-between border border-[#2D3340] rounded-xl p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={season.active}
                      onChange={() => handleActivateSeason(season.id)}
                    />
                    <p className="font-semibold">{season.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Orden B2: {season.sequence.join(' › ')}</p>
                  <button
                    className="text-xs text-rose-400 mt-2 font-semibold"
                    onClick={() => setSelectedSeasonId(season.id)}
                  >
                    Abrir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedSeasonId && (
          <SeasonDetail
            season={seasons.find((s) => s.id === selectedSeasonId)}
            onClose={() => setSelectedSeasonId(null)}
          />
        )}
      </section>
    </div>
  );

  const renderHistory = () => {
    const seasonOptions = profileSeasons.filter((s) => s.active || s.id);
    const activeFilter = selectedSeasonId || seasonOptions[0]?.id;
    const filteredLogs = logs
      .filter((log) => log.profileId === profileId)
      .filter((log) => !activeFilter || log.seasonId === activeFilter)
      .sort((a, b) => b.date - a.date);

    return (
      <div className="w-full min-h-full pb-24">
        {renderHeader()}
        <section className="px-4 pt-4 space-y-4">
          <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Historial</h2>
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-500 font-semibold">Temporada</p>
                <select
                  className="bg-[#0B0E14] border border-[#2D3340] rounded-lg px-3 py-2 text-sm"
                  value={activeFilter}
                  onChange={(e) => setSelectedSeasonId(e.target.value)}
                >
                  {seasonOptions.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {filteredLogs.length === 0 && (
                <p className="text-sm text-slate-500">No hay sesiones registradas aún.</p>
              )}
              {filteredLogs.map((log) => {
                const season = seasons.find((s) => s.id === log.seasonId);
                const workout = season?.workouts[log.workoutId];
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between border border-[#2D3340] rounded-xl p-3"
                  >
                    <div>
                      <p className="text-xs text-slate-500">{formatDate(log.date)}</p>
                      <p className="font-semibold">{workout?.name || 'Workout'}</p>
                      <p className="text-xs text-slate-500">{season?.title}</p>
                    </div>
                    <span className="material-symbols-rounded text-slate-500">chevron_right</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderContent = () => {
    if (!isLoggedIn) return renderLogin();
    if (view === 'session') return renderSession();
    if (view === 'seasons') return renderSeasons();
    if (view === 'history') return renderHistory();
    return renderHome();
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#0B0E14] text-white">
      <div className="w-full max-w-md min-h-screen relative">
        {renderContent()}

        {isLoggedIn && view !== 'session' && (
          <nav className="fixed bottom-0 left-0 w-full glass safe-pb pt-2 z-40">
            <div className="flex justify-around items-center h-14">
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${view === 'today' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setView('today')}
              >
                <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">event</span>
                <span className="text-[10px] font-medium">Hoy</span>
              </button>
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${view === 'seasons' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setView('seasons')}
              >
                <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">calendar_month</span>
                <span className="text-[10px] font-medium">Temporadas</span>
              </button>
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${view === 'history' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setView('history')}
              >
                <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">history</span>
                <span className="text-[10px] font-medium">Historial</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

function SeasonDetail({ season, onClose }) {
  if (!season) return null;

  return (
    <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase text-slate-500 font-semibold">Temporada</p>
          <h3 className="text-lg font-bold">{season.title}</h3>
        </div>
        <button className="text-xs text-slate-400" onClick={onClose}>
          Cerrar
        </button>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Workouts (orden B2)</h4>
        {season.sequence.map((workoutId, idx) => {
          const workout = season.workouts[workoutId];
          return (
            <div
              key={workoutId}
              className="border border-[#2D3340] rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-slate-500">{idx + 1}.</p>
                <p className="font-semibold">{workout?.name}</p>
                <p className="text-xs text-slate-500">{workout?.items.length || 0} items</p>
              </div>
              <button className="text-xs text-rose-400 font-semibold">Editar</button>
            </div>
          );
        })}
        <button className="text-rose-400 font-semibold text-sm">+ Agregar workout</button>
      </div>
    </div>
  );
}
