# YMCA Training Log (Webapp)

Training log mobile-first para una pareja que entrena en Roxborough YMCA, pensado para usarse al inicio y al final de cada sesión.

## Contexto (leer antes de programar)
Esta webapp es un training log móvil (webapp) para uso compartido de una pareja que entrena en el Roxborough YMCA, con acceso a pesas (Strength), Cardio, Swim (piscina) y Sauna. La app se usa principalmente en dos momentos: al inicio del entrenamiento para ver de forma clara “qué toca hoy”, y al final para registrar lo realizado (especialmente peso por set y reps por set, de donde se obtiene sets totales) de manera rápida y cómoda desde el celular. Existen exactamente dos perfiles internos dentro de la misma cuenta: Sergio y Scarlett, ambos visibles y editables desde el mismo login compartido. El concepto central de planificación es por Temporadas: cada temporada se crea manualmente en detalle (workouts y ejercicios) y es independiente de las anteriores, por lo que no debe heredar ni sugerir pesos desde temporadas pasadas. Dentro de cada temporada se define un programa tipo B2: una lista fija y ordenada de workouts que se recorre en loop; como los días de entrenamiento son variables, el “hoy” depende del siguiente workout según el último completado, no del calendario. La plataforma se implementa con Next.js desplegado en Vercel y una Realtime Database en Firebase, usando Firebase Auth con un solo login para ambos, y reglas de seguridad para que solo el usuario autenticado acceda a su nodo de datos. El MVP debe priorizar simplicidad, mobile-first y un flujo sin fricción: seleccionar perfil, ver el próximo workout de la temporada activa, iniciar sesión, logear sets y métricas de cardio/swim/sauna, cerrar y que el sistema avance al siguiente workout de la lista dentro de la misma temporada.

## Objetivo MVP
1) Mostrar “Hoy” (siguiente workout de la temporada activa) para Sergio o Scarlett.
2) Iniciar una sesión (start) y al terminar registrar:
   - Strength: weight (lb) por set, reps por set, sets totales se infiere por cantidad de sets guardados.
   - Cardio: minutos (+ notas opcional).
   - Swim: distancia y/o minutos (+ notas opcional).
   - Sauna: minutos.
3) Mantener historial por temporada.
4) Permitir crear temporadas y su contenido manualmente (workouts e items).

## Stack
- Next.js (TypeScript) desplegado en Vercel
- Firebase Authentication (un solo login compartido)
- Firebase Realtime Database
- Mobile-first UI (Tailwind recomendado en el siguiente módulo)

## Conceptos clave
- Perfil: `sergio` y `scarlett` (claves internas fijas).
- Temporada: contenedor independiente del programa y del progreso. No hereda pesos de otras temporadas.
- Programa B2: lista fija de workouts con `order` y loop infinito.
- Workout item: elemento dentro del workout. Tipos soportados: `strength`, `cardio`, `swim`, `sauna`.
- Progreso: por temporada y perfil, se guarda el `lastWorkoutId` y `lastSessionId` para calcular “Hoy”.

## Documentación
- `docs/data-model.md`: modelo de datos propuesto para Realtime Database.
- `docs/conventions.md`: convenciones y decisiones (unidades, timestamps, nombres).
- `docs/modules.md`: plan de módulos secuenciales para implementar.
- `docs/context.md`: el mismo párrafo de contexto, en archivo separado.

## Próximo paso
Implementar el Módulo 1 (setup de Next.js y deploy en Vercel) usando `docs/modules.md` como guía.
