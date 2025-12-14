# YMCA Training Log (webapp)

Training log mobile-first para Sergio y Scarlett en el Roxborough YMCA. Un solo login en Firebase, con perfiles fijos, pensado para usar rápido desde el celular.

## Qué es la app
- Webapp Next.js + Firebase (Auth + Realtime Database).
- Solo dos perfiles internos: `sergio` y `scarlett`.
- Unidades en lb para strength; cardio/swim/sauna en minutos (swim también distancia).
- Temporadas independientes: cada una define su programa tipo B2 (workouts ordenados en loop).

## Flujo MVP
1) Seleccionar perfil.
2) Ver "Hoy": siguiente workout de la temporada activa según `progress` (no calendario).
3) Iniciar sesión de entrenamiento.
4) Loggear rápido por item:
   - Strength: `weightLb` y `reps` por set (sets totales = cantidad de sets).
   - Cardio/Swim/Sauna: minutos (Swim también distancia) + notas opcional.
5) Cerrar sesión y avanzar el `progress` al siguiente workout del programa.

## Cómo correr local
1) Requiere Node.js 18+ y npm.
2) Instalar dependencias cuando exista el código del frontend: `npm install`.
3) Variables de entorno (se agregarán en el Módulo 1) para Firebase.
4) Levantar en dev: `npm run dev` y abrir `http://localhost:3000`.

## Documentación
- `docs/context.md`: contexto completo.
- `docs/conventions.md`: convenciones (perfiles, unidades, tipos de item, timestamps).
- `docs/data-model.md`: árbol de datos y ejemplos JSON.
- `docs/modules.md`: plan de módulos secuenciales.

## Estado
Repositorio listo para arrancar el Módulo 1 (setup de Next.js y deploy en Vercel).
