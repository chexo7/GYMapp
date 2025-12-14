# Módulos secuenciales (plan de trabajo)

Este plan está diseñado para un desarrollador junior: tareas pequeñas, ordenadas, con Definition of Done.

## Módulo 0: Contexto y documentación base (este repo)
- README con contexto, objetivos, stack, conceptos.
- docs con modelo de datos y convenciones.
- Plan de módulos.

## Módulo 1: Setup del proyecto web
- Next.js + TypeScript.
- Rutas placeholder.
- Deploy en Vercel.

## Módulo 2: Firebase base
- Firebase project.
- Auth email/password.
- Realtime Database.
- Config en env vars y wrapper `lib/firebase.ts`.

## Módulo 3: Security Rules
- Estructura `/app/{uid}`.
- Reglas: solo `auth.uid` puede leer y escribir su nodo.

## Módulo 4: Login y guards
- Pantalla `/login`.
- Protección de rutas.
- Logout.

## Módulo 5: Bootstrap perfiles
- Crear `profiles` si no existen.
- Selector de perfil (sergio/scarlett).

## Módulo 6: Temporadas
- CRUD temporadas.
- Activar temporada por perfil.

## Módulo 7: Workouts (B2)
- CRUD workouts por temporada.
- Campo `order` y ordenamiento.

## Módulo 8: Workout items
- CRUD items por workout.
- Tipos: strength, cardio, swim, sauna.

## Módulo 9: Home “Hoy”
- Cálculo del siguiente workout por `progress`.
- Mostrar workout e items.

## Módulo 10: Sesión (start, log, end)
- Start session.
- Logging de strength sets y cardio/swim/sauna.
- End session + update `progress`.

## Módulo 11: Historial
- Listado por temporada.
- Detalle de sesión.

## Módulo 12: UX móvil y PWA
- Inputs grandes y navegación rápida.
- Confirmaciones.
- PWA opcional.
