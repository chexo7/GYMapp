'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const IMAGE_MAP = {
  hero: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSnQA4K3uVHyRUslz7LaUyzqFcKFdQzwK1K0rNGupWFDGDFPjC8SHzGjKVOlQWGekc98JRvqm4IxjPk-JmWu0Jn7S0tTjhFZvstbjDIFia-GTs3TYJsrHovw1U65_HwIag8nRTppBt9R7uA1gvMN0qPX6JxfmsmHDzD9CR7sQ71QhMj1ZA',
  sergio: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSk6omJ7zVXuKmv8xm3evVv33Ka_PCLwht9IcqUinqrJhoeniZdRHujCGNJVKbiknxsZREDKy3lEmmhCmkLW6VbYWQqjWxTj5TTcQmKmwtuRKzqCuC2ln2Dr2AKZ-WhAq_N8b4jdIUQFgRHHNsJatU6yyoT-SmGxsblkYBy6as2QeBoKvQ',
  scarlett: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSld3DSgZ853agAlBmmuyn1U_U9tB4UWczqbaJL-7PnYV32j8WhKsuqrbuzqAT7n5_99-8_3d0oCRCGHYb6jje-8e1pm0j5TgyozaGi73UfAXO3vJBuCvOTirWLSN-zQYGjl2GtoyyTHDOvhrG4WUarhsidQoViC1MalyhsAhu8rl9QSjA',
  workoutA: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSl2qPzkdGgGaWKh7PF882zcPd94nSde2bpAgKb6UGSYIVAYHyOWXHjG5HAHKnWHas2srd4biyO0-6x-WMTzAy6Z0p-RRNhDCR1XrA_29EXln6Z1KufIeuwwrKYn7wQpWXLAcOmIeY8Ug4o63W9LcCrfQ7XjlQhSiN2nhFpZuErlu5wI6Q',
  workoutB: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSklKpVNZGoDzCM0tUga8QacmuoZIfivamJOgecaWe-dUsRkmmEVv1RktSPvbC8De7s4OykDI0O5G_OIx0ouTWfSkbGusa3hNV4stdrLSYE4QlsLl7zSOhHTcWjc6hpZgeqGxXahus3tk278IPksDtZ7u_J20FVRvI8ANutYRXMZTJ_Fsg',
  workoutC: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSldj9Wpg7M6ZKptu5KUkQ8x0Qvx2NxzgRm2RaO-J-o8db2gcmWtMabxG582E7HGlgJcHdWxWDSKrwHU4yjanYmyC7lrY11_0JDR0A7gqrVG1G6j2-bqrcE2IWigt3mA7DCkQ-2Cr1YPxTU_RiiJb40qd2ubgDQ-SjH-YDuCfHTrNezE',
  workoutD: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSn5KK3Cy8_rHSjuTH1fw59j8fw-Ls3BMBd-1KYRv7fPGP6DIISbKdbZMmTgltuM0gx_U0exI9nVbjrXyudEwOo9ekBBs9R21_Kk_n_eEAqrGh-n6n-FwpnTlP0I38qKf4OVznNNLpt0ArfU955jz1jIXam3Gi_O3le9t7zJs2cxQwzMJQ',
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

const SEASON_DATA = {
  id: 'winter_2024',
  title: 'Winter Arc 2024',
  sequence: ['A', 'B', 'C', 'D'],
  workouts: {
    A: {
      id: 'A',
      name: 'Upper Power',
      type: 'Strength',
      img: IMAGE_MAP.workoutA,
      exercises: ['Barbell Bench Press', 'Pendlay Row', 'Overhead Press', 'Weighted Pull Ups'],
    },
    B: {
      id: 'B',
      name: 'Lower Power',
      type: 'Strength',
      img: IMAGE_MAP.workoutB,
      exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raises'],
    },
    C: {
      id: 'C',
      name: 'Full Body Hypertrophy',
      type: 'Strength',
      img: IMAGE_MAP.workoutC,
      exercises: ['Incline DB Press', 'Bulgarian Split Squat', 'Lat Pulldown', 'Lateral Raises'],
    },
    D: {
      id: 'D',
      name: 'Cardio & Recovery',
      type: 'Cardio',
      img: IMAGE_MAP.workoutD,
      exercises: ['Freestyle Swim', 'Sauna Recovery'],
    },
  },
};

const initialLogs = [
  { id: 1, userId: 'sergio', workoutId: 'A', date: Date.now() - 86400000 * 3, summary: 'Bench 225x5' },
  { id: 2, userId: 'scarlett', workoutId: 'C', date: Date.now() - 86400000 * 1, summary: 'Good session' },
];

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('es-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [logs, setLogs] = useState(initialLogs);
  const [activeSession, setActiveSession] = useState(null);

  const userLogs = useMemo(() => {
    if (!currentUser) return [];
    return [...logs]
      .filter((log) => log.userId === currentUser.id)
      .sort((a, b) => b.date - a.date);
  }, [logs, currentUser]);

  const nextWorkout = useMemo(() => {
    if (!currentUser) return null;
    if (userLogs.length === 0) return SEASON_DATA.workouts[SEASON_DATA.sequence[0]];

    const lastWorkout = userLogs[0].workoutId;
    const lastIndex = SEASON_DATA.sequence.indexOf(lastWorkout);
    const nextIndex = lastIndex === -1 ? 0 : (lastIndex + 1) % SEASON_DATA.sequence.length;
    return SEASON_DATA.workouts[SEASON_DATA.sequence[nextIndex]];
  }, [currentUser, userLogs]);

  const handleLogin = (userId) => {
    setCurrentUser(USERS[userId]);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSession(null);
    setView('login');
  };

  const downloadData = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roxborough_logs_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startSession = () => {
    if (!currentUser || !nextWorkout) return;
    const session = {
      workoutId: nextWorkout.id,
      startedAt: Date.now(),
    };
    setActiveSession(session);
    const newLog = {
      id: logs.length + 1,
      userId: currentUser.id,
      workoutId: nextWorkout.id,
      date: Date.now(),
      summary: 'Sesión iniciada',
    };
    setLogs([newLog, ...logs]);
  };

  const renderLogin = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-end pb-12 fade-in">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <Image src={IMAGE_MAP.hero} alt="Roxborough" fill className="object-cover brightness-[0.4]" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noreferrer"
          className="bg-black/30 backdrop-blur border border-white/10 text-xs text-slate-300 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-rounded text-sm">folder_zip</span>
          Deploy en Vercel
        </a>
      </div>

      <div className="relative z-10 w-full px-8 text-center mb-12">
        <span className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6 shadow-xl">
          <span className="material-symbols-rounded text-5xl text-rose-500">fitness_center</span>
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Roxborough<br />Training Log</h1>
        <p className="text-slate-400 font-medium text-sm mb-10">Selecciona tu perfil para comenzar</p>

        <div className="space-y-4">
          {Object.values(USERS).map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className="w-full group relative overflow-hidden bg-[#151921] hover:bg-[#1E232E] border border-[#2D3340] p-1 rounded-2xl flex items-center transition-all active:scale-95"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 bg-slate-800 shrink-0 relative">
                <Image src={user.avatarUrl} alt={user.name} fill className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-xs text-slate-500">Continuar Temporada</p>
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

  const renderDashboard = () => (
    <div className="w-full min-h-full pb-32 pt-20 px-6 slide-up">
      <div className="mb-6">
        <p className="text-slate-400 text-sm font-medium">Hola, {currentUser?.name} 👋</p>
        <h2 className="text-3xl font-bold text-white">¿Qué toca hoy?</h2>
      </div>

      {nextWorkout && (
        <div
          className="w-full relative aspect-[4/5] bg-[#151921] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 border border-[#2D3340] mb-8 group cursor-pointer"
          onClick={startSession}
        >
          <Image src={nextWorkout.img} alt={nextWorkout.name} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase rounded-md tracking-wider shadow-lg shadow-rose-500/30">
                Próximo
              </span>
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
                {nextWorkout.type}
              </span>
            </div>
            <h3 className="text-4xl font-black text-white leading-[0.9] mb-2 tracking-tight">{nextWorkout.name}</h3>
            <p className="text-slate-300 text-sm mb-6 truncate">{nextWorkout.exercises.join(' • ')}</p>

            <button className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl">
              <span className="material-symbols-rounded filled">play_arrow</span> Iniciar Entrenamiento
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <span className="material-symbols-rounded text-lg">history</span>
            <span className="text-xs font-bold uppercase">Último</span>
          </div>
          <p className="text-white font-bold text-sm leading-tight">
            {userLogs[0] ? SEASON_DATA.workouts[userLogs[0].workoutId].name : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{userLogs[0] ? formatDate(userLogs[0].date) : '-'}</p>
        </div>
        <div className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <span className="material-symbols-rounded text-lg">fitness_center</span>
            <span className="text-xs font-bold uppercase">Sesión</span>
          </div>
          <p className="text-white font-bold text-xl">{activeSession ? 'Activa' : 'En pausa'}</p>
          <p className="text-[10px] text-emerald-500 mt-1">{activeSession ? 'Seguimiento en curso' : 'Listo para empezar'}</p>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="w-full min-h-full pb-32 pt-20 px-6 slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Historial</h2>
        <button
          onClick={downloadData}
          className="flex items-center gap-2 bg-[#1E232E] hover:bg-[#252b38] border border-[#2D3340] px-3 py-2 rounded-lg text-xs font-bold text-slate-300 transition-colors"
        >
          <span className="material-symbols-rounded text-base">download</span>
          Exportar
        </button>
      </div>

      <div className="space-y-3">
        {userLogs.length === 0 && (
          <div className="text-center text-slate-500 bg-[#151921] border border-[#2D3340] rounded-2xl py-6">
            Aún no hay sesiones registradas.
          </div>
        )}
        {userLogs.map((log) => (
          <div
            key={log.id}
            className="bg-[#151921] border border-[#2D3340] p-4 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-400">{formatDate(log.date)}</p>
              <p className="text-white font-bold">{SEASON_DATA.workouts[log.workoutId].name}</p>
              <p className="text-xs text-slate-500">{log.summary}</p>
            </div>
            <span className="material-symbols-rounded text-slate-500">chevron_right</span>
          </div>
        ))}
      </div>
    </div>
  );

  const mainView = () => {
    if (!currentUser) return renderLogin();
    if (view === 'history') return renderHistory();
    return renderDashboard();
  };

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="w-full max-w-md h-screen flex flex-col relative bg-[#0B0E14] shadow-2xl">
        {currentUser && (
          <header className="absolute top-0 left-0 w-full z-50 p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-[#0B0E14] to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <span className="material-symbols-rounded text-sm">calendar_month</span>
              </div>
              <div>
                <h1 className="text-xs text-slate-400 font-medium uppercase tracking-wider">Temporada</h1>
                <p className="text-sm font-bold text-white leading-none">{SEASON_DATA.title}</p>
              </div>
            </div>
            <button
              className="w-8 h-8 rounded-full bg-[#151921] border border-[#2D3340] flex items-center justify-center active:scale-95 transition hover:bg-slate-800"
              onClick={handleLogout}
            >
              <span className="material-symbols-rounded text-slate-400 text-sm">logout</span>
            </button>
          </header>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth bg-[#0B0E14]">
          {mainView()}
        </main>

        {currentUser && (
          <nav className="absolute bottom-0 w-full glass safe-pb pt-2 z-40">
            <div className="flex justify-around items-center h-14">
              <button
                className={`nav-btn group flex flex-col items-center gap-1 w-1/3 ${view === 'dashboard' ? 'text-rose-500' : 'text-slate-500'}`}
                onClick={() => setView('dashboard')}
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
