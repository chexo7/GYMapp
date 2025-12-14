'use client';

import { useEffect, useMemo, useState } from 'react';

const IMAGE_MAP = {
  sergio: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSk6omJ7zVXuKmv8xm3evVv33Ka_PCLwht9IcqUinqrJhoeniZdRHujCGNJVKbiknxsZREDKy3lEmmhCmkLW6VbYWQqjWxTj5TTcQmKmwtuRKzqCuC2ln2Dr2AKZ-WhAq_N8b4jdIUQFgRHHNsJatU6yyoT-SmGxsblkYBy6as2QeBoKvQ',
  scarlett:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSld3DSgZ853agAlBmmuyn1U_U9tB4UWczqbaJL-7PnYV32j8WhKsuqrbuzqAT7n5_99-83d0oCRCGHYb6jje-8e1pm0j5TgyozaGi73UfAXO3vJBuCvOTirWLSN-zQYGjl2GtoyyTHDOvhrG4WUarhsidQoViC1MalyhsAhu8rl9QSjA',
  workoutA:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80&sat=-50&bri=-10&blend=0B0E14&sat=-90&blend-mode=multiply',
  workoutB:
    'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=400&q=80&sat=-50&bri=-10&blend=0B0E14&sat=-90&blend-mode=multiply',
  workoutC:
    'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=400&q=80&sat=-50&bri=-10&blend=0B0E14&sat=-90&blend-mode=multiply',
  workoutD:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80&sat=-50&bri=-10&blend=0B0E14&sat=-90&blend-mode=multiply',
};

const USERS = {
  sergio: {
    id: 'sergio',
    name: 'Sergio',
    avatarUrl: IMAGE_MAP.sergio,
  },
  scarlett: {
    id: 'scarlett',
    name: 'Scarlett',
    avatarUrl: IMAGE_MAP.scarlett,
  },
};

const defaultWorkouts = {
  upper1: {
    id: 'upper1',
    name: 'Upper 1',
    type: 'strength',
    image: IMAGE_MAP.workoutA,
    items: [
      { id: 'bench', name: 'Bench Press', kind: 'strength', sets: 3, reps: '8-12' },
      { id: 'row', name: 'Row', kind: 'strength', sets: 3, reps: '8-12' },
      { id: 'cardio', name: 'Cardio: Treadmill', kind: 'cardio' },
      { id: 'sauna', name: 'Sauna', kind: 'sauna' },
    ],
  },
  lower1: {
    id: 'lower1',
    name: 'Lower 1',
    type: 'strength',
    image: IMAGE_MAP.workoutB,
    items: [
      { id: 'squat', name: 'Back Squat', kind: 'strength', sets: 3, reps: '8-12' },
      { id: 'rdl', name: 'Romanian Deadlift', kind: 'strength', sets: 3, reps: '8-12' },
      { id: 'bike', name: 'Cardio: Bike', kind: 'cardio' },
      { id: 'sauna', name: 'Sauna', kind: 'sauna' },
    ],
  },
  swim1: {
    id: 'swim1',
    name: 'Swim 1',
    type: 'swim',
    image: IMAGE_MAP.workoutC,
    items: [
      { id: 'swim', name: 'Swim', kind: 'swim' },
      { id: 'sauna', name: 'Sauna', kind: 'sauna' },
    ],
  },
};

const initialSeasons = {
  sergio: [
    {
      id: 'fuerza1',
      name: 'Fuerza 1',
      active: true,
      sequence: ['upper1', 'lower1', 'swim1'],
      workouts: [defaultWorkouts.upper1, defaultWorkouts.lower1, defaultWorkouts.swim1],
    },
  ],
  scarlett: [
    {
      id: 'base-nov',
      name: 'Base Noviembre',
      active: true,
      sequence: ['upper1', 'lower1', 'swim1'],
      workouts: [defaultWorkouts.upper1, defaultWorkouts.lower1, defaultWorkouts.swim1],
    },
  ],
};

const initialHistory = [
  {
    id: 'sess-1',
    profileId: 'sergio',
    seasonId: 'fuerza1',
    workoutId: 'upper1',
    date: Date.now() - 86400000 * 2,
    summary: 'Bench y remo listos',
    entries: [],
  },
  {
    id: 'sess-2',
    profileId: 'sergio',
    seasonId: 'fuerza1',
    workoutId: 'lower1',
    date: Date.now() - 86400000 * 4,
    summary: 'Lower day completo',
    entries: [],
  },
  {
    id: 'sess-3',
    profileId: 'scarlett',
    seasonId: 'base-nov',
    workoutId: 'upper1',
    date: Date.now() - 86400000 * 3,
    summary: 'Press fuerte',
    entries: [],
  },
];

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('es-US', {
    month: 'short',
    day: 'numeric',
  });

const cloneItemsForSession = (items) =>
  items.map((item) => ({
    ...item,
    setsLogged: item.kind === 'strength' ? Array.from({ length: item.sets || 0 }, () => ({ weight: '', reps: '' })) : [],
    metrics: item.kind !== 'strength' ? { minutes: '', distance: '', notes: '' } : undefined,
  }));

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profileId, setProfileId] = useState('sergio');
  const [seasons, setSeasons] = useState(initialSeasons);
  const [seasonDetailId, setSeasonDetailId] = useState('fuerza1');
  const [historySeasonId, setHistorySeasonId] = useState('fuerza1');
  const [history, setHistory] = useState(initialHistory);
  const [activeSession, setActiveSession] = useState(null);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutType, setNewWorkoutType] = useState('strength');
  const [newItemName, setNewItemName] = useState('');
  const [newItemKind, setNewItemKind] = useState('strength');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('upper1');

  const currentSeason = useMemo(() => {
    const list = seasons[profileId] || [];
    return (
      list.find((season) => season.id === seasonDetailId) || list.find((season) => season.active) || list[0] || null
    );
  }, [profileId, seasonDetailId, seasons]);

  const nextWorkout = useMemo(() => {
    if (!currentSeason) return null;
    const userHistory = history
      .filter((entry) => entry.profileId === profileId && entry.seasonId === currentSeason.id)
      .sort((a, b) => b.date - a.date);
    if (userHistory.length === 0) {
      return currentSeason.workouts.find((workout) => workout.id === currentSeason.sequence[0]);
    }
    const lastWorkoutId = userHistory[0].workoutId;
    const lastIndex = currentSeason.sequence.indexOf(lastWorkoutId);
    const nextIndex = lastIndex === -1 ? 0 : (lastIndex + 1) % currentSeason.sequence.length;
    return currentSeason.workouts.find((workout) => workout.id === currentSeason.sequence[nextIndex]);
  }, [currentSeason, history, profileId]);

  useEffect(() => {
    const list = seasons[profileId];
    if (list?.length) {
      const active = list.find((season) => season.active) || list[0];
      setSeasonDetailId(active.id);
      setHistorySeasonId(active.id);
      setSelectedWorkoutId(active.sequence[0]);
    }
  }, [profileId, seasons]);

  const updateSeason = (seasonId, updater) => {
    setSeasons((prev) => ({
      ...prev,
      [profileId]: prev[profileId].map((season) => (season.id === seasonId ? updater(season) : season)),
    }));
  };

  const activateSeason = (seasonId) => {
    setSeasons((prev) => ({
      ...prev,
      [profileId]: prev[profileId].map((season) => ({
        ...season,
        active: season.id === seasonId,
      })),
    }));
    setSeasonDetailId(seasonId);
    setHistorySeasonId(seasonId);
  };

  const addSeason = () => {
    if (!newSeasonName.trim()) return;
    const id = newSeasonName.toLowerCase().replace(/\s+/g, '-');
    const newSeason = {
      id,
      name: newSeasonName,
      active: false,
      sequence: ['upper1', 'lower1', 'swim1'],
      workouts: [
        { ...defaultWorkouts.upper1, id: 'upper1' },
        { ...defaultWorkouts.lower1, id: 'lower1' },
        { ...defaultWorkouts.swim1, id: 'swim1' },
      ],
    };
    setSeasons((prev) => ({ ...prev, [profileId]: [...(prev[profileId] || []), newSeason] }));
    setNewSeasonName('');
  };

  const addWorkout = () => {
    if (!currentSeason || !newWorkoutName.trim()) return;
    const id = newWorkoutName.toLowerCase().replace(/\s+/g, '-') + '-' + (currentSeason.workouts.length + 1);
    const workout = {
      id,
      name: newWorkoutName,
      type: newWorkoutType,
      image: IMAGE_MAP.workoutD,
      items: [],
    };
    updateSeason(currentSeason.id, (season) => ({
      ...season,
      workouts: [...season.workouts, workout],
      sequence: [...season.sequence, id],
    }));
    setNewWorkoutName('');
    setSelectedWorkoutId(id);
  };

  const addItemToWorkout = () => {
    if (!currentSeason || !newItemName.trim() || !selectedWorkoutId) return;
    updateSeason(currentSeason.id, (season) => ({
      ...season,
      workouts: season.workouts.map((workout) => {
        if (workout.id !== selectedWorkoutId) return workout;
        const newItem = {
          id: `${workout.id}-${Date.now()}`,
          name: newItemName,
          kind: newItemKind,
          sets: newItemKind === 'strength' ? 3 : undefined,
          reps: newItemKind === 'strength' ? '8-12' : undefined,
        };
        return { ...workout, items: [...workout.items, newItem] };
      }),
    }));
    setNewItemName('');
  };

  const startSession = () => {
    if (!currentSeason || !nextWorkout) return;
    const session = {
      id: `sess-${Date.now()}`,
      profileId,
      seasonId: currentSeason.id,
      workoutId: nextWorkout.id,
      startedAt: Date.now(),
      entries: cloneItemsForSession(nextWorkout.items),
    };
    setActiveSession(session);
    setActiveTab('session');
  };

  const updateSetValue = (itemId, setIndex, field, value) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) => {
          if (entry.id !== itemId) return entry;
          const setsLogged = entry.setsLogged.map((set, idx) => (idx === setIndex ? { ...set, [field]: value } : set));
          return { ...entry, setsLogged };
        }),
      };
    });
  };

  const addSetRow = (itemId) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id === itemId ? { ...entry, setsLogged: [...entry.setsLogged, { weight: '', reps: '' }] } : entry,
        ),
      };
    });
  };

  const updateMetric = (itemId, field, value) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) => (entry.id === itemId ? { ...entry, metrics: { ...entry.metrics, [field]: value } } : entry)),
      };
    });
  };

  const endSession = () => {
    if (!activeSession) return;
    const newHistoryEntry = {
      ...activeSession,
      date: Date.now(),
      summary: 'Sesión completada',
    };
    setHistory((prev) => [newHistoryEntry, ...prev]);
    setActiveSession(null);
    setActiveTab('home');
  };

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#0B0E14] via-[#0B0E14] to-transparent px-6 pt-6 pb-3 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
            <span className="material-symbols-rounded text-xl">fitness_center</span>
          </div>
          <div>
            <p className="text-[11px] uppercase text-slate-400 font-semibold tracking-[0.08em]">Temporada activa</p>
            <p className="text-white font-bold text-sm leading-tight">{currentSeason?.name || 'Sin temporada'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="bg-[#151921] border border-[#2D3340] text-slate-200 text-sm font-semibold rounded-xl px-3 py-2"
          >
            {Object.values(USERS).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-9 h-9 rounded-full bg-[#151921] border border-[#2D3340] flex items-center justify-center active:scale-95"
          >
            <span className="material-symbols-rounded text-slate-400 text-sm">logout</span>
          </button>
        </div>
      </div>
    </header>
  );

  const renderLogin = () => (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-8">
        <span className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <span className="material-symbols-rounded text-4xl text-rose-500">lock_open_right</span>
        </span>
        <h1 className="text-3xl font-black">Login compartido</h1>
        <p className="text-slate-400 text-sm mt-2">Un acceso para Sergio y Scarlett. Selecciona y entra.</p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
          onClick={() => setIsLoggedIn(true)}
        >
          Entrar
        </button>
        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 text-left">
          <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Perfiles</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <span className="text-white font-semibold">{USERS.sergio.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <span className="text-white font-semibold">{USERS.scarlett.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="pt-28 pb-28 px-6 space-y-6">
      <section className="bg-[#151921] border border-[#2D3340] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Temporada activa</p>
            <h2 className="text-xl font-black text-white">{currentSeason?.name}</h2>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">B2 Loop</span>
        </div>
        <div className="bg-[#0f1219] border border-[#2D3340] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <span className="material-symbols-rounded">schedule</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Siguiente workout</p>
            <p className="text-lg font-bold text-white leading-tight">{nextWorkout?.name || 'Sin definir'}</p>
            <p className="text-[12px] text-slate-500">Orden B2 según último registrado</p>
          </div>
        </div>
      </section>

      <section className="bg-[#151921] border border-[#2D3340] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Items de hoy</h3>
          <span className="text-xs text-slate-400">{nextWorkout?.items.length || 0} movimientos</span>
        </div>
        <div className="space-y-3">
          {nextWorkout?.items.map((item, idx) => (
            <div key={item.id} className="bg-[#0f1219] border border-[#2D3340] rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  {idx + 1}. {item.name}
                </p>
                {item.kind === 'strength' && (
                  <p className="text-xs text-slate-400">
                    {item.sets} sets, {item.reps}
                  </p>
                )}
                {item.kind !== 'strength' && <p className="text-xs text-slate-400 capitalize">{item.kind}</p>}
              </div>
              <span className="material-symbols-rounded text-slate-600">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={startSession}
        className="fixed bottom-24 left-4 right-4 bg-rose-500 hover:bg-rose-400 text-white font-black py-4 rounded-2xl shadow-2xl shadow-rose-500/30 active:scale-95"
      >
        EMPEZAR SESIÓN
      </button>
    </div>
  );

  const renderSession = () => {
    if (!activeSession) {
      return (
        <div className="pt-28 pb-20 px-6 text-center text-slate-400">
          <p>No hay sesión activa. Inicia desde “Hoy”.</p>
        </div>
      );
    }

    const workoutName = currentSeason?.workouts.find((w) => w.id === activeSession.workoutId)?.name;

    return (
      <div className="pt-24 pb-28 px-6 space-y-4">
        <div className="bg-[#151921] border border-[#2D3340] rounded-3xl p-5">
          <p className="text-xs text-slate-400 uppercase font-semibold">Sesión en curso</p>
          <h2 className="text-2xl font-black text-white mb-1">{workoutName}</h2>
          <p className="text-xs text-emerald-400">Perfil: {USERS[profileId].name}</p>
        </div>

        {activeSession.entries.map((item) => (
          <div key={item.id} className="bg-[#151921] border border-[#2D3340] rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{item.name}</p>
                {item.kind === 'strength' ? (
                  <p className="text-xs text-slate-400">{item.sets} x {item.reps}</p>
                ) : (
                  <p className="text-xs text-slate-400 capitalize">{item.kind}</p>
                )}
              </div>
              {item.kind === 'strength' && (
                <button
                  onClick={() => addSetRow(item.id)}
                  className="text-xs px-3 py-1 bg-[#0f1219] border border-[#2D3340] rounded-full text-white"
                >
                  + Agregar set
                </button>
              )}
            </div>

            {item.kind === 'strength' && (
              <div className="space-y-2">
                {item.setsLogged.map((set, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-10">Set {idx + 1}</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSetValue(item.id, idx, 'weight', e.target.value)}
                      placeholder="lb"
                      className="flex-1 bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSetValue(item.id, idx, 'reps', e.target.value)}
                      placeholder="reps"
                      className="w-20 bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {item.kind !== 'strength' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={item.metrics?.minutes || ''}
                  onChange={(e) => updateMetric(item.id, 'minutes', e.target.value)}
                  placeholder="Minutos"
                  className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                />
                {item.kind === 'swim' && (
                  <input
                    type="text"
                    value={item.metrics?.distance || ''}
                    onChange={(e) => updateMetric(item.id, 'distance', e.target.value)}
                    placeholder="Distancia"
                    className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                  />
                )}
                <input
                  type="text"
                  value={item.metrics?.notes || ''}
                  onChange={(e) => updateMetric(item.id, 'notes', e.target.value)}
                  placeholder="Notas"
                  className="col-span-2 bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>
        ))}

        <button
          onClick={endSession}
          className="fixed bottom-24 left-4 right-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 active:scale-95"
        >
          TERMINAR Y GUARDAR
        </button>
      </div>
    );
  };

  const renderSeasons = () => (
    <div className="pt-28 pb-28 px-6 space-y-6">
      <section className="bg-[#151921] border border-[#2D3340] rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white">Temporadas</h2>
          <button
            onClick={addSeason}
            className="text-xs px-3 py-2 bg-[#0f1219] border border-[#2D3340] rounded-xl text-white font-semibold"
          >
            + Crear temporada
          </button>
        </div>
        <div className="space-y-3">
          {(seasons[profileId] || []).map((season) => (
            <div key={season.id} className="bg-[#0f1219] border border-[#2D3340] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <label className="flex items-center gap-2 text-white font-semibold">
                  <input
                    type="radio"
                    name="activeSeason"
                    checked={season.active}
                    onChange={() => activateSeason(season.id)}
                  />
                  {season.name}
                </label>
                <p className="text-xs text-slate-500">{season.sequence.length} workouts en B2</p>
              </div>
              <button
                onClick={() => setSeasonDetailId(season.id)}
                className="text-xs text-rose-400 font-bold underline"
              >
                Abrir
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
              placeholder="Nombre de temporada"
              className="flex-1 bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {currentSeason && (
        <section className="bg-[#151921] border border-[#2D3340] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Temporada</p>
              <h3 className="text-xl font-black text-white">{currentSeason.name}</h3>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200">Orden B2</span>
          </div>

          <div className="space-y-3">
            {currentSeason.sequence.map((workoutId, idx) => {
              const workout = currentSeason.workouts.find((w) => w.id === workoutId);
              return (
                <div key={workoutId} className="bg-[#0f1219] border border-[#2D3340] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Workout {idx + 1}</p>
                      <p className="text-lg font-bold text-white">{workout?.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{workout?.type}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWorkoutId(workoutId)}
                      className={`text-xs px-3 py-1 rounded-full border ${selectedWorkoutId === workoutId ? 'border-rose-500 text-rose-400' : 'border-[#2D3340] text-slate-300'}`}
                    >
                      Editar
                    </button>
                  </div>
                  {selectedWorkoutId === workoutId && workout && (
                    <div className="bg-[#111622] border border-[#2D3340] rounded-xl p-3 space-y-3">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Items</p>
                      {workout.items.map((item, itemIdx) => (
                        <div key={item.id} className="flex items-center justify-between text-sm text-white">
                          <span>
                            {itemIdx + 1}) {item.name}
                            {item.kind === 'strength' && (
                              <span className="text-slate-400 text-xs"> — {item.sets} sets, {item.reps}</span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-500 capitalize">{item.kind}</span>
                        </div>
                      ))}

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Nuevo item"
                          className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm col-span-2"
                        />
                        <select
                          value={newItemKind}
                          onChange={(e) => setNewItemKind(e.target.value)}
                          className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
                        >
                          <option value="strength">strength</option>
                          <option value="cardio">cardio</option>
                          <option value="swim">swim</option>
                          <option value="sauna">sauna</option>
                        </select>
                        <button
                          onClick={addItemToWorkout}
                          className="bg-rose-500 text-white rounded-xl px-3 py-2 font-semibold active:scale-95"
                        >
                          + Agregar item
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              placeholder="Nuevo workout"
              className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
            />
            <select
              value={newWorkoutType}
              onChange={(e) => setNewWorkoutType(e.target.value)}
              className="bg-[#0f1219] border border-[#2D3340] rounded-xl px-3 py-2 text-sm"
            >
              <option value="strength">strength</option>
              <option value="cardio">cardio</option>
              <option value="swim">swim</option>
              <option value="sauna">sauna</option>
            </select>
            <button
              onClick={addWorkout}
              className="col-span-2 bg-[#0f1219] border border-[#2D3340] text-white rounded-xl px-3 py-3 font-semibold active:scale-95"
            >
              + Agregar workout
            </button>
          </div>
        </section>
      )}
    </div>
  );

  const renderHistory = () => {
    const filteredHistory = history
      .filter((entry) => entry.profileId === profileId && entry.seasonId === historySeasonId)
      .sort((a, b) => b.date - a.date);

    return (
      <div className="pt-28 pb-24 px-6 space-y-4">
        <div className="bg-[#151921] border border-[#2D3340] rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Historial</p>
              <h2 className="text-xl font-black text-white">Sesiones guardadas</h2>
            </div>
            <select
              value={historySeasonId}
              onChange={(e) => setHistorySeasonId(e.target.value)}
              className="bg-[#0f1219] border border-[#2D3340] text-slate-200 text-sm font-semibold rounded-xl px-3 py-2"
            >
              {(seasons[profileId] || []).map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredHistory.map((entry) => {
            const workout = currentSeason?.workouts.find((w) => w.id === entry.workoutId) || { name: entry.workoutId };
            return (
              <details key={entry.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <div>
                    <p className="text-sm text-slate-400">{formatDate(entry.date)}</p>
                    <p className="text-white font-bold leading-tight">{workout.name}</p>
                    <p className="text-xs text-slate-500">{entry.summary}</p>
                  </div>
                  <span className="material-symbols-rounded text-slate-500">expand_more</span>
                </summary>
                <div className="mt-3 space-y-2">
                  {entry.entries.length === 0 && (
                    <p className="text-xs text-slate-500">Sin detalle guardado.</p>
                  )}
                  {entry.entries.map((item, idx) => (
                    <div key={idx} className="bg-[#0f1219] border border-[#2D3340] rounded-xl p-3">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      {item.kind === 'strength' ? (
                        <div className="space-y-1 mt-1 text-xs text-slate-400">
                          {item.setsLogged.map((set, setIdx) => (
                            <div key={setIdx} className="flex gap-2">
                              <span className="w-10">Set {setIdx + 1}</span>
                              <span>{set.weight || '-'} lb</span>
                              <span>{set.reps || '-'} reps</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">
                          {item.metrics?.minutes && <span>{item.metrics.minutes} min </span>}
                          {item.metrics?.distance && <span>• {item.metrics.distance} </span>}
                          {item.metrics?.notes && <span>• {item.metrics.notes}</span>}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMain = () => {
    if (!isLoggedIn) return renderLogin();

    switch (activeTab) {
      case 'home':
        return (
          <>
            {renderHeader()}
            {renderHome()}
          </>
        );
      case 'seasons':
        return (
          <>
            {renderHeader()}
            {renderSeasons()}
          </>
        );
      case 'history':
        return (
          <>
            {renderHeader()}
            {renderHistory()}
          </>
        );
      case 'session':
        return (
          <>
            {renderHeader()}
            {renderSession()}
          </>
        );
      default:
        return null;
    }
  };

  const renderNavigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 glass safe-pb pt-2 pb-4 z-40">
      <div className="max-w-md mx-auto flex justify-around items-center h-14 px-4">
        <button
          className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${activeTab === 'home' ? 'text-rose-500' : 'text-slate-500'}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">dashboard</span>
          <span className="text-[10px] font-medium">Hoy</span>
        </button>
        <button
          className="nav-btn -mt-8 bg-rose-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-rose-600/30 text-white active:scale-90 transition active:bg-rose-500"
          onClick={startSession}
        >
          <span className="material-symbols-rounded text-3xl">play_arrow</span>
        </button>
        <button
          className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${activeTab === 'history' ? 'text-rose-500' : 'text-slate-500'}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">history</span>
          <span className="text-[10px] font-medium">Historial</span>
        </button>
      </div>
      <div className="max-w-md mx-auto px-4 flex justify-center gap-6 mt-2 text-xs text-slate-400">
        <button
          className={`px-3 py-2 rounded-full ${activeTab === 'seasons' ? 'bg-rose-500/20 text-rose-400' : 'bg-[#151921] border border-[#2D3340]'}`}
          onClick={() => setActiveTab('seasons')}
        >
          Temporadas
        </button>
        <button
          className={`px-3 py-2 rounded-full ${activeTab === 'session' ? 'bg-rose-500/20 text-rose-400' : 'bg-[#151921] border border-[#2D3340]'}`}
          onClick={() => setActiveTab('session')}
        >
          Sesión en curso
        </button>
      </div>
    </nav>
  );

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#0B0E14] text-white">
      <div className="w-full max-w-md min-h-screen relative">
        {renderMain()}
        {isLoggedIn && renderNavigation()}
      </div>
    </div>
  );
}
