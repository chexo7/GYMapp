'use client';

import { useMemo, useState } from 'react';

const WORKOUT_LIBRARY = {
  upper1: {
    id: 'upper1',
    name: 'Upper 1',
    type: 'Fuerza superior',
    items: [
      { id: 'bench', name: 'Bench Press', type: 'strength', sets: 3, reps: '8-12' },
      { id: 'row', name: 'Row', type: 'strength', sets: 3, reps: '8-12' },
      { id: 'treadmill', name: 'Treadmill', type: 'cardio', target: 'Opcional' },
      { id: 'sauna', name: 'Sauna', type: 'sauna', target: 'Opcional' },
    ],
  },
  lower1: {
    id: 'lower1',
    name: 'Lower 1',
    type: 'Fuerza inferior',
    items: [
      { id: 'squat', name: 'Back Squat', type: 'strength', sets: 3, reps: '8-12' },
      { id: 'rdl', name: 'Romanian Deadlift', type: 'strength', sets: 3, reps: '8-12' },
      { id: 'bike', name: 'Bike', type: 'cardio', target: 'Opcional' },
    ],
  },
  swim1: {
    id: 'swim1',
    name: 'Swim 1',
    type: 'Swim/Recovery',
    items: [
      { id: 'swim', name: 'Pool', type: 'swim', target: 'Libre' },
      { id: 'sauna', name: 'Sauna', type: 'sauna', target: 'Recuperación' },
    ],
  },
};

const DEFAULT_PROFILES = {
  sergio: {
    id: 'sergio',
    name: 'Sergio',
    seasons: [
      {
        id: 'fuerza1',
        name: 'Fuerza 1',
        order: ['upper1', 'lower1', 'swim1'],
        workouts: WORKOUT_LIBRARY,
      },
      {
        id: 'base-nov',
        name: 'Base Noviembre',
        order: ['upper1', 'lower1'],
        workouts: WORKOUT_LIBRARY,
      },
    ],
    activeSeasonId: 'fuerza1',
    logs: [
      {
        id: 'log-1',
        workoutId: 'upper1',
        seasonId: 'fuerza1',
        date: Date.now() - 86400000 * 2,
        summary: 'Bench 3x10 con buena técnica',
      },
      {
        id: 'log-2',
        workoutId: 'lower1',
        seasonId: 'base-nov',
        date: Date.now() - 86400000 * 4,
        summary: 'Piernas sólidas',
      },
    ],
  },
  scarlett: {
    id: 'scarlett',
    name: 'Scarlett',
    seasons: [
      {
        id: 'fuerza1',
        name: 'Fuerza 1',
        order: ['upper1', 'lower1', 'swim1'],
        workouts: WORKOUT_LIBRARY,
      },
    ],
    activeSeasonId: 'fuerza1',
    logs: [
      {
        id: 'log-3',
        workoutId: 'upper1',
        seasonId: 'fuerza1',
        date: Date.now() - 86400000 * 1,
        summary: 'Upper 1 completo',
      },
    ],
  },
};

const TABS = {
  TODAY: 'today',
  SEASONS: 'seasons',
  HISTORY: 'history',
  SESSION: 'session',
  LOGIN: 'login',
};

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  });

const cloneProfiles = () => JSON.parse(JSON.stringify(DEFAULT_PROFILES));
const findSeason = (profile, seasonId) => profile.seasons.find((s) => s.id === seasonId);

export default function HomePage() {
  const [profiles, setProfiles] = useState(cloneProfiles);
  const [currentProfileId, setCurrentProfileId] = useState('sergio');
  const [activeTab, setActiveTab] = useState(TABS.LOGIN);
  const [session, setSession] = useState(null);
  const [seasonDetailId, setSeasonDetailId] = useState('fuerza1');
  const [workoutDetailId, setWorkoutDetailId] = useState('upper1');

  const currentProfile = profiles[currentProfileId];
  const activeSeason = currentProfile.seasons.find((s) => s.id === currentProfile.activeSeasonId) ??
    currentProfile.seasons[0];

  const profileLogs = useMemo(() => {
    return [...currentProfile.logs].sort((a, b) => b.date - a.date);
  }, [currentProfile.logs]);

  const activeSeasonLogs = profileLogs.filter((log) => log.seasonId === activeSeason.id);

  const nextWorkout = useMemo(() => {
    if (!activeSeason) return null;
    if (activeSeasonLogs.length === 0) return activeSeason.workouts[activeSeason.order[0]];

    const lastWorkout = activeSeasonLogs[0].workoutId;
    const lastIndex = activeSeason.order.indexOf(lastWorkout);
    const nextIndex = lastIndex === -1 ? 0 : (lastIndex + 1) % activeSeason.order.length;
    return activeSeason.workouts[activeSeason.order[nextIndex]];
  }, [activeSeason, activeSeasonLogs]);

  const startSession = () => {
    if (!nextWorkout) return;
    const itemsState = nextWorkout.items.reduce((acc, item) => {
      if (item.type === 'strength') {
        acc[item.id] = Array.from({ length: item.sets }, () => ({ weight: '', reps: '' }));
      } else {
        acc[item.id] = { primary: '', secondary: '' };
      }
      return acc;
    }, {});

    setSession({
      id: `session-${Date.now()}`,
      profileId: currentProfile.id,
      seasonId: activeSeason.id,
      workoutId: nextWorkout.id,
      startedAt: Date.now(),
      entries: itemsState,
    });
    setActiveTab(TABS.SESSION);
  };

  const updateStrengthValue = (itemId, setIndex, field, value) => {
    if (!session) return;
    setSession((prev) => {
      const existingSets = prev.entries[itemId] || [];
      const sets = existingSets.map((set, idx) => (idx === setIndex ? { ...set, [field]: value } : set));
      if (setIndex === existingSets.length) {
        sets.push({ weight: '', reps: '' });
      }
      return { ...prev, entries: { ...prev.entries, [itemId]: sets } };
    });
  };

  const updateOtherEntry = (itemId, field, value) => {
    if (!session) return;
    setSession((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [itemId]: { ...prev.entries[itemId], [field]: value },
      },
    }));
  };

  const finishSession = () => {
    if (!session) return;
    const newLog = {
      id: `log-${Date.now()}`,
      workoutId: session.workoutId,
      seasonId: session.seasonId,
      date: Date.now(),
      summary: 'Sesión guardada',
      session,
    };

    setProfiles((prev) => ({
      ...prev,
      [currentProfileId]: {
        ...prev[currentProfileId],
        logs: [newLog, ...prev[currentProfileId].logs],
      },
    }));

    setSession(null);
    setActiveTab(TABS.TODAY);
  };

  const addStrengthSet = (itemId) => {
    if (!session) return;
    setSession((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [itemId]: [...prev.entries[itemId], { weight: '', reps: '' }],
      },
    }));
  };

  const createSeason = () => {
    const name = prompt('Nombre de la temporada');
    if (!name) return;
    const newSeason = {
      id: `season-${Date.now()}`,
      name,
      order: ['upper1', 'lower1', 'swim1'],
      workouts: WORKOUT_LIBRARY,
    };
    setProfiles((prev) => ({
      ...prev,
      [currentProfileId]: {
        ...prev[currentProfileId],
        seasons: [...prev[currentProfileId].seasons, newSeason],
      },
    }));
    setSeasonDetailId(newSeason.id);
  };

  const activateSeason = (seasonId) => {
    setProfiles((prev) => ({
      ...prev,
      [currentProfileId]: {
        ...prev[currentProfileId],
        activeSeasonId: seasonId,
      },
    }));
    setSeasonDetailId(seasonId);
  };

  const seasonForDetail = currentProfile.seasons.find((s) => s.id === seasonDetailId) ?? activeSeason;
  const workoutForDetail = seasonForDetail.workouts[workoutDetailId] ?? nextWorkout;
  const sessionSeason = session ? findSeason(currentProfile, session.seasonId) : null;

  const workoutNameForLog = (log) => {
    const season = findSeason(currentProfile, log.seasonId) ?? activeSeason;
    return season?.workouts[log.workoutId]?.name || log.workoutId;
  };

  const header = (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-[#0B0E14] via-[#0B0E14] to-transparent px-4 pb-3 pt-5 border-b border-white/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Perfil</p>
          <div className="flex items-center gap-2">
            {['sergio', 'scarlett'].map((id) => (
              <button
                key={id}
                onClick={() => setCurrentProfileId(id)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold border transition ${
                  currentProfileId === id
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-[#151921] border-[#2D3340] text-slate-200'
                }`}
              >
                {profiles[id].name}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Temporada activa</p>
          <p className="text-sm font-bold text-white">{activeSeason?.name}</p>
        </div>
      </div>
    </header>
  );

  const renderToday = () => (
    <div className="pb-28 px-4 pt-2 space-y-6">
      <section className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Siguiente workout</p>
            <h2 className="text-2xl font-black text-white">{nextWorkout?.name || '—'}</h2>
            <p className="text-sm text-slate-500">B2 loop según el último hecho</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Última sesión</p>
            <p className="text-sm font-semibold text-white">
              {activeSeasonLogs[0]?.workoutId ? activeSeason.workouts[activeSeasonLogs[0].workoutId].name : 'Sin registros'}
            </p>
            <p className="text-xs text-slate-500">{activeSeasonLogs[0] ? formatDate(activeSeasonLogs[0].date) : '—'}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Items de hoy</h3>
          <span className="text-[11px] text-slate-500">{nextWorkout?.items.length || 0} items</span>
        </div>
        <div className="space-y-3">
          {nextWorkout?.items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3 bg-[#0f131b] border border-[#2D3340] rounded-xl p-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-white">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                {item.type === 'strength' && (
                  <p className="text-xs text-slate-400">{item.sets} sets, {item.reps} reps</p>
                )}
                {item.type !== 'strength' && (
                  <p className="text-xs text-slate-400">{item.type} · {item.target}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-16 left-0 right-0 px-6">
        <button
          onClick={startSession}
          className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg shadow-xl active:scale-95 transition"
        >
          EMPEZAR SESIÓN
        </button>
      </div>
    </div>
  );

  const renderSession = () => {
    const workout = sessionSeason?.workouts[session?.workoutId];

    return (
      <div className="pb-28 px-4 pt-4 space-y-4">
        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
          <p className="text-xs text-slate-400">Sesión en curso</p>
          <h2 className="text-2xl font-black text-white">{workout?.name}</h2>
          <p className="text-sm text-slate-400">{sessionSeason?.name}</p>
          <p className="text-sm text-emerald-400">Inicio: {formatDate(session?.startedAt)}</p>
        </div>

        {workout?.items.map((item) => (
          <div key={item.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <span className="text-xs text-slate-400 capitalize">{item.type}</span>
            </div>

            {item.type === 'strength' && session?.entries[item.id] && (
              <div className="space-y-2">
                {session.entries[item.id].map((set, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-12 text-xs text-slate-400">Set {idx + 1}</span>
                    <input
                      value={set.weight}
                      onChange={(e) => updateStrengthValue(item.id, idx, 'weight', e.target.value)}
                      placeholder="lb/kg"
                      className="flex-1 rounded-lg bg-[#0f131b] border border-[#2D3340] px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <input
                      value={set.reps}
                      onChange={(e) => updateStrengthValue(item.id, idx, 'reps', e.target.value)}
                      placeholder="reps"
                      className="w-20 rounded-lg bg-[#0f131b] border border-[#2D3340] px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                ))}
                <button
                  onClick={() => addStrengthSet(item.id)}
                  className="text-xs text-rose-400 font-bold"
                >
                  + Agregar set
                </button>
              </div>
            )}

            {item.type !== 'strength' && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block">Minutos / Distancia / Notas</label>
                <input
                  value={session?.entries[item.id]?.primary || ''}
                  onChange={(e) => updateOtherEntry(item.id, 'primary', e.target.value)}
                  className="w-full rounded-lg bg-[#0f131b] border border-[#2D3340] px-3 py-2 text-sm text-white focus:outline-none"
                  placeholder="Registra duración o distancia"
                />
                <input
                  value={session?.entries[item.id]?.secondary || ''}
                  onChange={(e) => updateOtherEntry(item.id, 'secondary', e.target.value)}
                  className="w-full rounded-lg bg-[#0f131b] border border-[#2D3340] px-3 py-2 text-sm text-white focus:outline-none"
                  placeholder="Notas opcionales"
                />
              </div>
            )}
          </div>
        ))}

        <div className="fixed bottom-16 left-0 right-0 px-6">
          <button
            onClick={finishSession}
            className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold text-lg shadow-xl active:scale-95 transition"
          >
            TERMINAR Y GUARDAR
          </button>
        </div>
      </div>
    );
  };

  const renderSeasons = () => (
    <div className="pb-24 px-4 pt-2 space-y-5">
      <section className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Temporadas por perfil</h3>
          <button
            onClick={createSeason}
            className="text-xs font-bold text-rose-400"
          >
            + Crear temporada
          </button>
        </div>
        <div className="space-y-3">
          {currentProfile.seasons.map((season) => (
            <div
              key={season.id}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                season.id === currentProfile.activeSeasonId ? 'border-rose-400 bg-rose-400/10' : 'border-[#2D3340] bg-[#0f131b]'
              }`}
            >
              <div>
                <p className="text-white font-semibold">{season.name}</p>
                <p className="text-xs text-slate-500">{season.order.length} workouts en B2</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-3 py-1 rounded-full bg-[#151921] border border-[#2D3340] text-slate-200"
                  onClick={() => {
                    setSeasonDetailId(season.id);
                    setWorkoutDetailId(season.order[0]);
                  }}
                >
                  Abrir
                </button>
                <input
                  type="radio"
                  name="activeSeason"
                  checked={season.id === currentProfile.activeSeasonId}
                  onChange={() => activateSeason(season.id)}
                  className="accent-rose-500"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Temporada seleccionada</p>
            <h3 className="text-xl font-bold text-white">{seasonForDetail?.name}</h3>
          </div>
        </div>

        <div className="space-y-2">
          {seasonForDetail?.order.map((workoutId, idx) => (
            <div
              key={workoutId}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                workoutId === workoutDetailId ? 'border-rose-400 bg-rose-400/10' : 'border-[#2D3340] bg-[#0f131b]'
              }`}
              onClick={() => setWorkoutDetailId(workoutId)}
            >
              <div>
                <p className="text-xs text-slate-500">{idx + 1}. {seasonForDetail.workouts[workoutId].type || 'B2'}</p>
                <p className="text-white font-semibold">{seasonForDetail.workouts[workoutId].name}</p>
              </div>
              <span className="text-xs text-rose-300 font-bold">Editar</span>
            </div>
          ))}
          <button className="text-xs font-bold text-rose-400">+ Agregar workout</button>
        </div>
      </section>

      <section className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
        <h3 className="text-lg font-bold text-white">Workout: {workoutForDetail?.name}</h3>
        <div className="space-y-3">
          {workoutForDetail?.items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3 bg-[#0f131b] border border-[#2D3340] rounded-xl p-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-white">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                {item.type === 'strength' && (
                  <p className="text-xs text-slate-400">{item.sets} sets · {item.reps} reps</p>
                )}
                {item.type !== 'strength' && (
                  <p className="text-xs text-slate-400">{item.type} · {item.target}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="text-xs font-bold text-rose-400">+ Agregar item</button>
      </section>
    </div>
  );

  const renderHistory = () => (
    <div className="pb-20 px-4 pt-2 space-y-4">
      <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Perfil</p>
          <p className="text-white font-semibold">{currentProfile.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Temporada</p>
          <p className="text-white font-semibold">{activeSeason?.name}</p>
        </div>
      </div>

      <div className="space-y-3">
        {profileLogs.map((log) => (
          <div key={log.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{formatDate(log.date)}</p>
              <p className="text-white font-bold">{workoutNameForLog(log)}</p>
              <p className="text-xs text-slate-500">{log.summary}</p>
            </div>
            <button className="text-xs px-3 py-1 rounded-full bg-[#0f131b] border border-[#2D3340] text-slate-200">Ver</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#0B0E14]">
      <div className="mb-8">
        <p className="text-xs uppercase text-rose-400 font-bold tracking-[0.2em]">GYM CHECK-IN</p>
        <h1 className="text-4xl font-black text-white leading-tight mt-2">Temporadas B2
          <br />Sergio & Scarlett</h1>
        <p className="text-slate-400 mt-4">Un solo login compartido para arrancar y cerrar el día.</p>
      </div>
      <button
        onClick={() => setActiveTab(TABS.TODAY)}
        className="w-full max-w-sm py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg shadow-xl active:scale-95 transition"
      >
        Entrar
      </button>
    </div>
  );

  const renderContent = () => {
    if (activeTab === TABS.LOGIN) return renderLogin();
    if (activeTab === TABS.SESSION && session) return (
      <div className="min-h-screen flex flex-col bg-[#0B0E14]">
        {header}
        <main className="flex-1 overflow-y-auto no-scrollbar">{renderSession()}</main>
      </div>
    );

    return (
      <div className="min-h-screen flex flex-col bg-[#0B0E14]">
        {header}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === TABS.TODAY && renderToday()}
          {activeTab === TABS.SEASONS && renderSeasons()}
          {activeTab === TABS.HISTORY && renderHistory()}
        </main>
        <nav className="fixed bottom-0 left-0 right-0 glass safe-pb">
          <div className="flex items-center justify-around h-14 px-2">
            <button
              className={`flex flex-col items-center text-xs font-semibold ${activeTab === TABS.TODAY ? 'text-rose-400' : 'text-slate-400'}`}
              onClick={() => setActiveTab(TABS.TODAY)}
            >
              <span className="text-lg">🏠</span>
              Hoy
            </button>
            <button
              className={`flex flex-col items-center text-xs font-semibold ${activeTab === TABS.SEASONS ? 'text-rose-400' : 'text-slate-400'}`}
              onClick={() => setActiveTab(TABS.SEASONS)}
            >
              <span className="text-lg">📅</span>
              Temporadas
            </button>
            <button
              className={`flex flex-col items-center text-xs font-semibold ${activeTab === TABS.HISTORY ? 'text-rose-400' : 'text-slate-400'}`}
              onClick={() => setActiveTab(TABS.HISTORY)}
            >
              <span className="text-lg">📜</span>
              Historial
            </button>
          </div>
        </nav>
      </div>
    );
  };

  return renderContent();
}
