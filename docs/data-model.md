# Modelo de datos (Firebase Realtime Database)

Ruta raíz:
- `/app/{uid}/...`

Dentro del `uid` existe contenido para dos perfiles: `sergio` y `scarlett`.

## Árbol propuesto

```json
{
  "app": {
    "{uid}": {
      "profiles": {
        "sergio": { "name": "Sergio" },
        "scarlett": { "name": "Scarlett" }
      },
      "activeSeason": {
        "sergio": "{seasonId}",
        "scarlett": "{seasonId}"
      },
      "seasons": {
        "{profileId}": {
          "{seasonId}": { "name": "Temporada X", "createdAt": 1730000000000 }
        }
      },
      "workouts": {
        "{profileId}": {
          "{seasonId}": {
            "{workoutId}": { "name": "Upper 1", "order": 1 }
          }
        }
      },
      "workoutItems": {
        "{profileId}": {
          "{seasonId}": {
            "{workoutId}": {
              "{itemId}": {
                "type": "strength",
                "name": "Bench Press",
                "order": 1,
                "setsTarget": 3,
                "repsMin": 8,
                "repsMax": 12
              }
            }
          }
        }
      },
      "sessions": {
        "{profileId}": {
          "{seasonId}": {
            "{sessionId}": {
              "workoutId": "{workoutId}",
              "startedAt": 1730000000000,
              "endedAt": 1730003600000,
              "notes": ""
            }
          }
        }
      },
      "strengthSets": {
        "{profileId}": {
          "{seasonId}": {
            "{sessionId}": {
              "{itemId}": {
                "1": { "weightLb": 135, "reps": 10 },
                "2": { "weightLb": 135, "reps": 9 }
              }
            }
          }
        }
      },
      "sessionCardio": {
        "{profileId}": {
          "{seasonId}": {
            "{sessionId}": {
              "{itemId}": { "minutes": 12, "notes": "" }
            }
          }
        }
      },
      "sessionSwim": {
        "{profileId}": {
          "{seasonId}": {
            "{sessionId}": {
              "{itemId}": { "distance": 1000, "minutes": 25, "notes": "" }
            }
          }
        }
      },
      "sessionSauna": {
        "{profileId}": {
          "{seasonId}": {
            "{sessionId}": {
              "{itemId}": { "minutes": 10, "notes": "" }
            }
          }
        }
      },
      "progress": {
        "{profileId}": {
          "{seasonId}": {
            "lastWorkoutId": "{workoutId}",
            "lastSessionId": "{sessionId}"
          }
        }
      }
    }
  }
}
```

## Reglas de negocio (resumen)
- Temporadas independientes: no heredan pesos entre temporadas.
- Programa B2: workouts ordenados por `order` y se recorren en loop.
- “Hoy”: depende de `progress` (último workout completado) y no del calendario.
- Strength: registrar weightLb y reps por set. Sets totales = cantidad de sets guardados.
- Cardio, Swim, Sauna: registrar métricas por sesión.

## Cálculo de “Hoy” (B2 loop)
1) Leer `activeSeason/{profileId}`.
2) Leer workouts de la temporada activa y ordenar por `order`.
3) Leer `progress/{profileId}/{seasonId}/lastWorkoutId`.
4) Si no existe, usar el primer workout.
5) Si existe, devolver el siguiente en el array (wrap al primero).

## Recomendaciones MVP
- Mantener `progress` actualizado al cerrar una sesión para evitar queries complejas.
- Mantener `order` único por temporada (o manejar reordenamiento).
