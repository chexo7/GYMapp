# Convenciones

## Identidad y acceso
- Se usa Firebase Authentication con un solo usuario compartido.
- Todo el contenido cuelga de: `/app/{auth.uid}/...`

## Perfiles
- Claves internas fijas:
  - `sergio`
  - `scarlett`
- El nombre visible vive en `profiles/{profileId}/name`.

## Unidades y formato
- Peso: `weightLb` en libras (lb).
- Timestamps: milisegundos Unix (Number), por ejemplo `Date.now()`.
- Orden: usar campo `order` (entero positivo) para workouts e items.

## Tipos de workout item
- `strength`: requiere `setsTarget`, `repsMin`, `repsMax`.
- `cardio`: registro por sesión en minutos (+ `notes` opcional).
- `swim`: registro por sesión con `distance` y/o `minutes` (+ `notes` opcional).
- `sauna`: registro por sesión en minutos.

## IDs
- Se recomienda usar Firebase push IDs o UUIDs para:
  - `seasonId`, `workoutId`, `itemId`, `sessionId`.
- `setIndex` se guarda como entero 1..n dentro de cada ejercicio.

## Progreso y cálculo de “Hoy”
- Guardar progreso por perfil y temporada:
  - `progress/{profileId}/{seasonId}/lastWorkoutId`
  - `progress/{profileId}/{seasonId}/lastSessionId`
- “Hoy” se calcula como el siguiente workout en el orden B2 con wrap al primero.

## Independencia de temporadas
- La app no debe sugerir ni heredar pesos desde temporadas anteriores.
- Cualquier cálculo de “último set” o “última sesión” se limita a la temporada activa.
