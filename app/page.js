'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const IMAGE_MAP = {
  hero:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSnQA4K3uVHyRUslz7LaUyzqFcKFdQzwK1K0rNGupWFDGDFPjC8SHzGjKVOlQWGekc98JRvqm4IxjPk-JmWu0Jn7S0tTjhFZvstbjDIFia-GTs3TYJsrHovw1U65_HwIag8nRTppBt9R7uA1gvMN0qPX6JxfmsmHDzD9CR7sQ71QhMj1ZA',
  sergio:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSk6omJ7zVXuKmv8xm3evVv33Ka_PCLwht9IcqUinqrJhoeniZdRHujCGNJVKbiknxsZREDKy3lEmmhCmkLW6VbYWQqjWxTj5TTcQmKmwtuRKzqCuC2ln2Dr2AKZ-WhAq_N8b4jdIUQFgRHHNsJatU6yyoT-SmGxsblkYBy6as2QeBoKvQ',
  scarlett:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSld3DSgZ853agAlBmmuyn1U_U9tB4UWczqbaJL-7PnYV32j8WhKsuqrbuzqAT7n5_99-83d0oCRCGHYb6jje-8e1pm0j5TgyozaGi73UfAXO3vJBuCvOTirWLSN-zQYGjl2GtoyyTHDOvhrG4WUarhsidQoViC1MalyhsAhu8rl9QSjA',
  workoutA:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSl2qPzkdGgGaWKh7PF882zcPd94nSde2bpAgKb6UGSYIVAYHyOWXHjG5HAHKnWHas2srd4biyO0-6x-WMTzAy6Z0p-RRNhDCR1XrA_29EXln6Z1KufIeuwwrKYn7wQpWXLAcOmIeY8Ug4o63W9LcCrfQ7XjlQhSiN2nhFpZuErlu5wI6Q',
  workoutB:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSklKpVNZGoDzCM0tUga8QacmuoZIfivamJOgecaWe-dUsRkmmEVv1RktSPvbC8De7s4OykDI0O5G_OIx0ouTWfSkbGusa3hNV4stdrLSYE4QlsLl7zSOhHTcWjc6hpZgeqGxXahus3tk278IPksDtZ7u_J20FVRvI8ANutYRXMZTJ_Fsg',
  workoutC:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSldj9Wpg7M6ZKptu5KUkQ8x0Qvx2NxzgRm2RaO-J-o8db2gcmWtMabxG582E7HGlgJcHdxWDSKrwHU4yjanYmyC7lrY11_0JDR0A7gqrVG1G6j2-bqrcE2IWigt3mA7DCkQ-2Cr1YPxTU_RiiJb40qd2ubgDQ-SjH-YDuCfHTrNezE',
  workoutD:
    'https://lh3.googleusercontent.com/gg-dl/ABS2GSn5KK3Cy8_rHSjuTH1fw59j8fw-Ls3BMBd-1KYRv7fPGP6DIISbKdbZMmTgltuM0gx_U0exI9nVbjrXyudEwOo9ekBBs9R21_Kk_n_eEAqrGh-n6n-FwpnTlP0I38qKf4OVznNNLpt0ArfU955jz1jIXam3Gi_O3le9t7zJs2cxQwzMJQ',
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

const SEASON_LIBRARY = {
  sergio: [
    {
      id: 'fuerza-1',
      name: 'Fuerza 1',
      isActive: true,
      sequence: ['upper-1', 'lower-1', 'swim-1'],
      workouts: {
        'upper-1': {
          id: 'upper-1',
          name: 'Upper 1',
          type: 'strength',
          img: IMAGE_MAP.workoutA,
          items: [
            { id: 'bench', type: 'strength', name: 'Bench Press', sets: 3, reps: '8-12', defaultWeight: 135 },
            { id: 'row', type: 'strength', name: 'Row', sets: 3, reps: '8-12', defaultWeight: 115 },
            { id: 'cardio', type: 'cardio', name: 'Treadmill', target: 'Calentamiento opcional' },
            { id: 'sauna', type: 'sauna', name: 'Sauna', target: 'Recuperación' },
          ],
        },
        'lower-1': {
          id: 'lower-1',
          name: 'Lower 1',
          type: 'strength',
          img: IMAGE_MAP.workoutB,
          items: [
            { id: 'squat', type: 'strength', name: 'Back Squat', sets: 3, reps: '6-10', defaultWeight: 185 },
            { id: 'rdl', type: 'strength', name: 'Romanian Deadlift', sets: 3, reps: '8-12', defaultWeight: 155 },
            { id: 'bike', type: 'cardio', name: 'Bike', target: '10-15 min' },
            { id: 'sauna', type: 'sauna', name: 'Sauna', target: '10 min' },
          ],
        },
        'swim-1': {
          id: 'swim-1',
          name: 'Swim 1',
          type: 'recovery',
          img: IMAGE_MAP.workoutD,
          items: [
            { id: 'swim', type: 'swim', name: 'Swim', target: 'Distancia libre' },
            { id: 'sauna', type: 'sauna', name: 'Sauna', target: '8-12 min' },
          ],
        },
      },
    },
    {
      id: 'base-nov',
      name: 'Base Noviembre',
      isActive: false,
      sequence: ['upper-1', 'lower-1', 'swim-1'],
      workouts: {},
    },
  ],
  scarlett: [
    {
      id: 'fuerza-1-scar',
      name: 'Fuerza 1',
      isActive: true,
      sequence: ['upper-1', 'lower-1', 'swim-1'],
      workouts: {},
    },
  ],
};

const initialHistory = [
  {
    id: 1,
    userId: 'sergio',
    seasonId: 'fuerza-1',
    workoutId: 'lower-1',
    date: Date.now() - 86400000 * 2,
    summary: 'Lower 1 completado',
  },
  {
    id: 2,
    userId: 'scarlett',
    seasonId: 'fuerza-1-scar',
    workoutId: 'upper-1',
    date: Date.now() - 86400000 * 1,
    summary: 'Upper 1 con cardio',
  },
];

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('es-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getActiveSeason(seasons) {
  return seasons.find((s) => s.isActive) || seasons[0];
}

function getNextWorkout({ activeSeason, history, userId }) {
  if (!activeSeason) return null;
  const seasonLogs = history
    .filter((log) => log.userId === userId && log.seasonId === activeSeason.id)
    .sort((a, b) => b.date - a.date);

  const lastWorkoutId = seasonLogs[0]?.workoutId;
  const sequence = activeSeason.sequence;
  const nextIndex = lastWorkoutId ? (sequence.indexOf(lastWorkoutId) + 1) % sequence.length : 0;
  const nextId = sequence[nextIndex];
  return activeSeason.workouts[nextId];
}

function strengthItemFields(item) {
  return Array.from({ length: item.sets || 3 }, (_, index) => ({
    weight: item.defaultWeight || '',
    reps: '',
    index,
  }));
}

export default function HomePage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [tab, setTab] = useState('today');
  const [seasonMap, setSeasonMap] = useState(SEASON_LIBRARY);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState(initialHistory);
  const [selectedSeasonId, setSelectedSeasonId] = useState(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  const seasons = useMemo(() => (currentUserId ? seasonMap[currentUserId] || [] : []), [currentUserId, seasonMap]);
  const activeSeason = useMemo(() => (seasons.length ? getActiveSeason(seasons) : null), [seasons]);

  const nextWorkout = useMemo(
    () => (currentUserId && activeSeason ? getNextWorkout({ activeSeason, history, userId: currentUserId }) : null),
    [activeSeason, currentUserId, history],
  );

  const todaysItems = nextWorkout?.items || [];

  const userHistory = useMemo(
    () =>
      history
        .filter((log) => log.userId === currentUserId)
        .sort((a, b) => b.date - a.date),
    [history, currentUserId],
  );

  const seasonForHistoryFilter = activeSeason?.id || null;

  const filteredHistory = useMemo(() => {
    if (!seasonForHistoryFilter) return userHistory;
    return userHistory.filter((log) => log.seasonId === seasonForHistoryFilter);
  }, [seasonForHistoryFilter, userHistory]);

  const startSession = () => {
    if (!currentUserId || !nextWorkout || !activeSeason) return;

    const sessionPayload = nextWorkout.items.map((item) => {
      if (item.type === 'strength') {
        return { ...item, setsData: strengthItemFields(item) };
      }
      if (item.type === 'cardio') {
        return { ...item, minutes: '', notes: '' };
      }
      if (item.type === 'swim') {
        return { ...item, distance: '', minutes: '' };
      }
      return { ...item, minutes: '' };
    });

    setSession({
      id: Date.now(),
      userId: currentUserId,
      seasonId: activeSeason.id,
      workoutId: nextWorkout.id,
      startedAt: Date.now(),
      items: sessionPayload,
    });
    setTab('session');
  };

  const updateStrengthSet = (itemId, setIndex, field, value) => {
    setSession((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it) => {
        if (it.id !== itemId) return it;
        const hasSet = it.setsData.some((set) => set.index === setIndex);
        let setsData = it.setsData.map((set) =>
          set.index === setIndex ? { ...set, [field]: value } : set,
        );

        if (!hasSet) {
          setsData = [
            ...setsData,
            {
              index: setIndex,
              weight: field === 'weight' ? value : it.defaultWeight || '',
              reps: field === 'reps' ? value : '',
            },
          ];
        }

        return { ...it, setsData: setsData.sort((a, b) => a.index - b.index) };
      });
      return { ...prev, items };
    });
  };

  const updateSimpleField = (itemId, field, value) => {
    setSession((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it));
      return { ...prev, items };
    });
  };

  const finishSession = () => {
    if (!session) return;

    const newEntry = {
      id: history.length + 1,
      userId: session.userId,
      seasonId: session.seasonId,
      workoutId: session.workoutId,
      date: Date.now(),
      summary: 'Sesión guardada',
    };

    setHistory([newEntry, ...history]);
    setSession(null);
    setTab('today');
  };

  const changeSeason = (seasonId) => {
    setSeasonMap((prev) => ({
      ...prev,
      [currentUserId]: prev[currentUserId].map((season) => ({
        ...season,
        isActive: season.id === seasonId,
      })),
    }));
  };

  const createSeason = () => {
    const newSeason = {
      id: `temp-${Date.now()}`,
      name: 'Nueva temporada',
      isActive: false,
      sequence: ['upper-1', 'lower-1', 'swim-1'],
      workouts: {},
    };
    setSeasonMap((prev) => ({
      ...prev,
      [currentUserId]: [...(prev[currentUserId] || []), newSeason],
    }));
  };

  const openSeasonDetail = (seasonId) => {
    setSelectedSeasonId(seasonId);
    setTab('season-detail');
  };

  const openWorkoutDetail = (workoutId) => {
    setSelectedWorkoutId(workoutId);
    setTab('workout-detail');
  };

  const headerProfileSelector = currentUserId && (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800">
        <Image src={USERS[currentUserId].avatarUrl} alt={USERS[currentUserId].name} fill className="object-cover" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] uppercase text-slate-400 font-semibold">Perfil</span>
        <select
          value={currentUserId}
          onChange={(e) => {
            setCurrentUserId(e.target.value);
            setTab('today');
          }}
          className="bg-transparent text-white text-sm font-bold focus:outline-none"
        >
          {Object.values(USERS).map((user) => (
            <option key={user.id} value={user.id} className="bg-slate-900 text-white">
              {user.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const headerSeasonInfo = currentUserId && activeSeason && (
    <div className="flex flex-col text-right">
      <span className="text-[11px] uppercase text-slate-400 font-semibold">Temporada activa</span>
      <span className="text-sm font-bold text-white">{activeSeason.name}</span>
    </div>
  );

  const renderLogin = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-end pb-12 fade-in">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image src={IMAGE_MAP.hero} alt="Roxborough" fill className="object-cover brightness-[0.4]" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-8 text-center mb-12">
        <span className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6 shadow-xl">
          <span className="material-symbols-rounded text-5xl text-rose-500">fitness_center</span>
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Entrar al Gym</h1>
        <p className="text-slate-400 font-medium text-sm mb-10">Un solo login para Sergio y Scarlett</p>

        <div className="space-y-4">
          {Object.values(USERS).map((user) => (
            <button
              key={user.id}
              onClick={() => setCurrentUserId(user.id)}
              className="w-full group relative overflow-hidden bg-[#151921] hover:bg-[#1E232E] border border-[#2D3340] p-1 rounded-2xl flex items-center transition-all active:scale-95"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 bg-slate-800 shrink-0 relative">
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-xs text-slate-500">Tap para empezar</p>
              </div>
              <div className="pr-4">
                <span className="material-symbols-rounded text-slate-600 group-hover:text-white transition-colors">chevron_right</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderToday = () => (
    <div className="w-full min-h-full pb-32 pt-24 px-6 slide-up">
      <div className="mb-4">
        <p className="text-slate-400 text-sm font-medium">En 5 segundos sabes qué toca.</p>
        <h2 className="text-3xl font-bold text-white">Hoy</h2>
      </div>

      <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase font-semibold">Temporada activa</p>
          <p className="text-sm text-white font-bold">{activeSeason?.name || 'Sin temporada'}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase text-white">B2 loop</div>
      </div>

      {nextWorkout ? (
        <div className="bg-[#151921] border border-[#2D3340] rounded-[1.5rem] overflow-hidden shadow-2xl mb-6">
          <div className="relative h-48">
            <Image src={nextWorkout.img || IMAGE_MAP.workoutA} alt={nextWorkout.name} fill className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-rose-300 font-black">Siguiente workout</p>
                <h3 className="text-3xl font-black text-white leading-tight">{nextWorkout.name}</h3>
              </div>
              <button
                onClick={startSession}
                className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-rounded text-base">play_arrow</span>
                Empezar
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-slate-400 text-lg">list_alt</span>
              <p className="text-sm font-semibold text-white">Items de hoy</p>
            </div>
            {todaysItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#0f131c] border border-[#1f2633] rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-slate-500">{index + 1}) {item.type}</p>
                  <p className="text-white font-bold leading-tight">{item.name}</p>
                  {item.type === 'strength' && (
                    <p className="text-[11px] text-slate-500">{item.sets} sets · {item.reps} reps</p>
                  )}
                  {item.type !== 'strength' && <p className="text-[11px] text-slate-500">{item.target || 'Libre'}</p>}
                </div>
                <span className="material-symbols-rounded text-slate-500">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-6 text-center text-slate-500">
          No hay workout asignado.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <span className="material-symbols-rounded text-lg">history</span>
            <span className="text-xs font-bold uppercase">Último</span>
          </div>
          <p className="text-white font-bold text-sm leading-tight">
            {userHistory[0] ? activeSeason?.workouts?.[userHistory[0].workoutId]?.name || 'N/A' : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{userHistory[0] ? formatDate(userHistory[0].date) : '-'}</p>
        </div>
        <div className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <span className="material-symbols-rounded text-lg">fitness_center</span>
            <span className="text-xs font-bold uppercase">Sesión</span>
          </div>
          <p className="text-white font-bold text-xl">{session ? 'En curso' : 'Lista'}</p>
          <p className="text-[10px] text-emerald-500 mt-1">{session ? 'Seguimiento en curso' : 'Presiona empezar'}</p>
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-6 z-30 max-w-md mx-auto">
        <button
          onClick={startSession}
          className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
        >
          <span className="material-symbols-rounded text-2xl">play_arrow</span>
          Empezar sesión
        </button>
      </div>
    </div>
  );

  const renderSession = () => {
    const workout = activeSeason?.workouts?.[session?.workoutId];

    return (
      <div className="w-full min-h-full pb-32 pt-20 px-6 slide-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Sesión en curso</p>
            <h2 className="text-2xl font-bold text-white">{workout?.name}</h2>
            <p className="text-sm text-slate-500">Perfil: {USERS[currentUserId]?.name}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400">Live</span>
        </div>

        <div className="space-y-4">
          {session?.items.map((item) => (
            <div key={item.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs uppercase text-slate-500">{item.type}</p>
                  <p className="text-white font-bold">{item.name}</p>
                  {item.type === 'strength' && <p className="text-[11px] text-slate-500">{item.sets} x {item.reps}</p>}
                </div>
                {item.type === 'strength' && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-slate-400">Sets totales = filas</span>
                )}
              </div>

              {item.type === 'strength' && (
                <div className="space-y-2">
                  {item.setsData.map((set) => (
                    <div key={set.index} className="grid grid-cols-[1fr,1fr,1fr] gap-2 items-center text-sm">
                      <span className="text-slate-400">Set {set.index + 1}</span>
                      <input
                        type="number"
                        className="bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                        value={set.weight}
                        onChange={(e) => updateStrengthSet(item.id, set.index, 'weight', e.target.value)}
                        placeholder="lb"
                      />
                      <input
                        type="number"
                        className="bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                        value={set.reps}
                        onChange={(e) => updateStrengthSet(item.id, set.index, 'reps', e.target.value)}
                        placeholder="reps"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      updateStrengthSet(item.id, item.setsData.length, 'weight', item.defaultWeight || '')
                    }
                    className="mt-2 text-xs text-rose-400 flex items-center gap-1"
                  >
                    <span className="material-symbols-rounded text-sm">add</span> Agregar set
                  </button>
                </div>
              )}

              {item.type === 'cardio' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">Minutos</p>
                    <input
                      type="number"
                      className="w-full bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                      value={item.minutes}
                      onChange={(e) => updateSimpleField(item.id, 'minutes', e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">Notas</p>
                    <input
                      type="text"
                      className="w-full bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                      value={item.notes}
                      onChange={(e) => updateSimpleField(item.id, 'notes', e.target.value)}
                      placeholder="Objetivo opcional"
                    />
                  </div>
                </div>
              )}

              {item.type === 'swim' && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">Distancia</p>
                    <input
                      type="text"
                      className="w-full bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                      value={item.distance}
                      onChange={(e) => updateSimpleField(item.id, 'distance', e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">Minutos</p>
                    <input
                      type="number"
                      className="w-full bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                      value={item.minutes}
                      onChange={(e) => updateSimpleField(item.id, 'minutes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {item.type === 'sauna' && (
                <div className="text-sm">
                  <p className="text-[11px] uppercase text-slate-400 mb-1">Minutos</p>
                  <input
                    type="number"
                    className="w-full bg-[#0f131c] border border-[#1f2633] rounded-lg px-3 py-2 text-white"
                    value={item.minutes}
                    onChange={(e) => updateSimpleField(item.id, 'minutes', e.target.value)}
                    placeholder={item.target || '10'}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="fixed bottom-20 left-0 right-0 px-6 z-30 max-w-md mx-auto">
          <button
            onClick={finishSession}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
            <span className="material-symbols-rounded text-2xl">check_circle</span>
            Terminar y guardar
          </button>
        </div>
      </div>
    );
  };

  const renderSeasons = () => (
    <div className="w-full min-h-full pb-24 pt-24 px-6 slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase text-slate-400 font-semibold">Temporadas</p>
          <h2 className="text-2xl font-bold text-white">Perfil: {USERS[currentUserId]?.name}</h2>
        </div>
        <button
          onClick={createSeason}
          className="flex items-center gap-2 bg-[#1E232E] hover:bg-[#252b38] border border-[#2D3340] px-3 py-2 rounded-lg text-xs font-bold text-slate-300"
        >
          <span className="material-symbols-rounded text-base">add</span>
          Crear
        </button>
      </div>

      <div className="space-y-3">
        {seasons.map((season) => (
          <div key={season.id} className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="activeSeason"
                  checked={season.isActive}
                  onChange={() => changeSeason(season.id)}
                  className="accent-rose-500"
                />
                <div>
                  <p className="text-white font-bold">{season.name}</p>
                  <p className="text-[11px] text-slate-500">Orden B2 ({season.sequence.length} workouts)</p>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openSeasonDetail(season.id)}
                className="text-xs font-bold text-rose-400 flex items-center gap-1"
              >
                Abrir <span className="material-symbols-rounded text-sm">north_east</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSeasonDetail = () => {
    const season = seasons.find((s) => s.id === selectedSeasonId);
    if (!season) return null;

    return (
      <div className="w-full min-h-full pb-24 pt-24 px-6 slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase text-slate-400 font-semibold">Temporada</p>
            <h2 className="text-2xl font-bold text-white">{season.name}</h2>
            <p className="text-sm text-slate-500">Perfil: {USERS[currentUserId]?.name}</p>
          </div>
          <button onClick={() => setTab('seasons')} className="text-slate-400 text-sm flex items-center gap-1">
            <span className="material-symbols-rounded text-base">arrow_back</span> Volver
          </button>
        </div>

        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-bold">Workouts (orden B2)</h3>
            <button className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <span className="material-symbols-rounded text-sm">add</span> Agregar
            </button>
          </div>

          {season.sequence.map((workoutId, idx) => {
            const workout = season.workouts[workoutId] || { id: workoutId, name: workoutId, type: 'Pendiente' };
            return (
              <div key={workoutId} className="flex items-center justify-between bg-[#0f131c] border border-[#1f2633] rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs text-slate-500">{idx + 1}. {workout.type}</p>
                  <p className="text-white font-bold leading-tight">{workout.name}</p>
                </div>
                <button
                  onClick={() => openWorkoutDetail(workout.id)}
                  className="text-xs font-bold text-rose-400 flex items-center gap-1"
                >
                  Editar <span className="material-symbols-rounded text-sm">edit</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWorkoutDetail = () => {
    const season = seasons.find((s) => s.id === selectedSeasonId) || activeSeason;
    const workout = season?.workouts?.[selectedWorkoutId];
    const emptyState = (
      <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-6 text-center text-slate-500">
        Aún no hay items cargados para este workout.
      </div>
    );

    return (
      <div className="w-full min-h-full pb-24 pt-24 px-6 slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase text-slate-400 font-semibold">Workout</p>
            <h2 className="text-2xl font-bold text-white">{workout?.name || 'Pendiente'}</h2>
            <p className="text-sm text-slate-500">Items</p>
          </div>
          <button onClick={() => setTab('season-detail')} className="text-slate-400 text-sm flex items-center gap-1">
            <span className="material-symbols-rounded text-base">arrow_back</span> Volver
          </button>
        </div>

        <div className="bg-[#151921] border border-[#2D3340] rounded-2xl p-4 space-y-3">
          {workout?.items?.length ? (
            workout.items.map((item, idx) => (
              <div key={item.id} className="bg-[#0f131c] border border-[#1f2633] rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500">{idx + 1}) {item.type}</p>
                <p className="text-white font-bold">{item.name}</p>
                {item.type === 'strength' && (
                  <p className="text-[11px] text-slate-500">sets {item.sets}, reps {item.reps}</p>
                )}
                {item.type !== 'strength' && <p className="text-[11px] text-slate-500">{item.target || 'Libre'}</p>}
              </div>
            ))
          ) : (
            emptyState
          )}
          <button className="text-xs font-bold text-rose-400 flex items-center gap-1">
            <span className="material-symbols-rounded text-sm">add</span> Agregar item
          </button>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="w-full min-h-full pb-32 pt-24 px-6 slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs uppercase text-slate-400 font-semibold">Historial</p>
          <h2 className="text-2xl font-bold text-white">Perfil: {USERS[currentUserId]?.name}</h2>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase text-slate-400">Temporada</p>
          <p className="text-sm text-white font-bold">{activeSeason?.name}</p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 && (
          <div className="text-center text-slate-500 bg-[#151921] border border-[#2D3340] rounded-2xl py-6">
            Aún no hay sesiones registradas.
          </div>
        )}
        {filteredHistory.map((log) => (
          <div key={log.id} className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{formatDate(log.date)}</p>
              <p className="text-white font-bold">{activeSeason?.workouts?.[log.workoutId]?.name || log.workoutId}</p>
              <p className="text-xs text-slate-500">{log.summary}</p>
            </div>
            <span className="material-symbols-rounded text-slate-500">chevron_right</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (!currentUserId) return renderLogin();
    if (tab === 'session' && session) return renderSession();
    if (tab === 'seasons') return renderSeasons();
    if (tab === 'season-detail') return renderSeasonDetail();
    if (tab === 'workout-detail') return renderWorkoutDetail();
    if (tab === 'history') return renderHistory();
    return renderToday();
  };

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full max-w-md h-screen flex flex-col relative bg-[#0B0E14] shadow-2xl">
        {currentUserId && (
          <header className="absolute top-0 left-0 w-full z-50 p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-[#0B0E14] to-transparent">
            {headerProfileSelector}
            {headerSeasonInfo}
          </header>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth bg-[#0B0E14]">{renderContent()}</main>

        {currentUserId && tab !== 'session' && (
          <nav className="absolute bottom-0 w-full glass safe-pb pt-2 z-40">
            <div className="flex justify-around items-center h-14">
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${tab === 'today' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setTab('today')}
              >
                <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">dashboard</span>
                <span className="text-[10px] font-medium">Hoy</span>
              </button>
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${tab === 'seasons' || tab === 'season-detail' || tab === 'workout-detail' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setTab('seasons')}
              >
                <span className="material-symbols-rounded text-2xl group-active:scale-90 transition">event_note</span>
                <span className="text-[10px] font-medium">Temporadas</span>
              </button>
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${tab === 'history' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setTab('history')}
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
