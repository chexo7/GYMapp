# Modelo de datos (Firebase Realtime Database)

Ruta raíz: `/app/{uid}/...`. Dentro del `uid` viven los dos perfiles fijos (`sergio`, `scarlett`).

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

## Ejemplo simplificado (perfil Sergio)

```json
{
  "app": {
    "abcUid": {
      "activeSeason": { "sergio": "seasonA" },
      "seasons": {
        "sergio": { "seasonA": { "name": "Hipertrofia Q4", "createdAt": 1730500000000 } }
      },
      "workouts": {
        "sergio": {
          "seasonA": {
            "w1": { "name": "Upper 1", "order": 1 },
            "w2": { "name": "Lower 1", "order": 2 }
          }
        }
      },
      "workoutItems": {
        "sergio": {
          "seasonA": {
            "w1": {
              "bp": { "type": "strength", "name": "Bench Press", "order": 1, "setsTarget": 3, "repsMin": 8, "repsMax": 12 },
              "cardio": { "type": "cardio", "name": "Bike", "order": 2 }
            },
            "w2": {
              "sq": { "type": "strength", "name": "Back Squat", "order": 1, "setsTarget": 4, "repsMin": 6, "repsMax": 10 },
              "sauna": { "type": "sauna", "name": "Sauna", "order": 2 }
            }
          }
        }
      },
      "sessions": {
        "sergio": {
          "seasonA": {
            "sess1": { "workoutId": "w1", "startedAt": 1730570000000, "endedAt": 1730571800000, "notes": "" }
          }
        }
      },
      "strengthSets": {
        "sergio": {
          "seasonA": {
            "sess1": {
              "bp": {
                "1": { "weightLb": 135, "reps": 10 },
                "2": { "weightLb": 145, "reps": 8 },
                "3": { "weightLb": 145, "reps": 7 }
              }
            }
          }
        }
      },
      "sessionCardio": {
        "sergio": {
          "seasonA": {
            "sess1": {
              "cardio": { "minutes": 12, "notes": "resistencia" }
            }
          }
        }
      },
      "sessionSauna": {
        "sergio": {
          "seasonA": {
            "sess1": {
              "sauna": { "minutes": 10, "notes": "" }
            }
          }
        }
      },
      "progress": {
        "sergio": { "seasonA": { "lastWorkoutId": "w1", "lastSessionId": "sess1" } }
      }
    }
  }
}
```

## Reglas de negocio (resumen)
- Temporadas independientes: no heredan pesos entre temporadas.
- Programa B2: workouts ordenados por `order` y se recorren en loop.
- “Hoy”: depende de `progress` (último workout completado) y no del calendario.
- Strength: registrar `weightLb` y `reps` por set. Sets totales = cantidad de sets guardados.
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
