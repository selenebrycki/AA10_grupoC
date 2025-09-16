/**
 * MÓDULO DE CLASIFICACIÓN CON RED NEURONAL ARTIFICIAL (RNA)
 *
 * Este módulo simula una RNA de 3 capas para clasificar denuncias urbanas
 * según su prioridad (Alta, Media, Baja) basándose en las variables del PDF:
 * - V1: Tipo de incidente
 * - V2: Descripción (palabras clave)
 * - V3: Ubicación
 * - V4: Evidencia visual
 * - V5: Historial de reclamos (simulado)
 */

class ClasificadorRNA {
  constructor() {
    // Simulación de pesos entrenados para la RNA
    // En una implementación real, estos vendrían del entrenamiento
    this.pesosEntrada = {
      // Pesos para tipos de incidente (V1)
      baches: 0.7,
      alumbrado: 0.8,
      residuos: 0.4,
      semaforos: 0.9, // Alta prioridad - seguridad vial
      agua: 0.8, // Alta prioridad - servicio esencial
      arboles: 0.9, // Alta prioridad - peligro inmediato
      vandalismo: 0.5, // Media prioridad
      ruido: 0.3, // Baja prioridad
      incendio: 1.0, // Máxima prioridad - emergencia

      // Pesos para palabras clave críticas (V2)
      emergencia: 0.9,
      peligro: 0.8,
      urgente: 0.7,
      caido: 0.6,
      roto: 0.5,

      // Pesos para ubicaciones (V3)
      centro: 0.9, // Alta prioridad - zona crítica
      "residencial-norte": 0.5,
      "residencial-sur": 0.5,
      "residencial-este": 0.5,
      "residencial-oeste": 0.5,
      industrial: 0.7, // Media-alta prioridad
      comercial: 0.8, // Alta prioridad - zona comercial
      universitaria: 0.6, // Media prioridad
      hospital: 0.9, // Alta prioridad - zona crítica
      parque: 0.4, // Baja prioridad
    }

    // Simulación de historial de reclamos por zona (V5)
    this.historialZonas = {
      centro: 12,
      "residencial-norte": 4,
      "residencial-sur": 3,
      "residencial-este": 5,
      "residencial-oeste": 4,
      industrial: 8,
      comercial: 10,
      universitaria: 6,
      hospital: 2, // Pocos reclamos pero alta prioridad
      parque: 3,
    }
  }

  /**
   * PASO 1: CODIFICACIÓN DE VARIABLES (como especifica el PDF)
   * Convierte datos simbólicos a representación numérica
   */
  codificarVariables(datosFormulario) {
    console.log("[v0] Iniciando codificación de variables para RNA")

    // V1: One-Hot Encoding para tipo de incidente
    const tipoVector = this.oneHotEncoding(datosFormulario.tipo, [
      "baches",
      "alumbrado",
      "residuos",
      "semaforos",
      "agua",
      "arboles",
      "vandalismo",
      "ruido",
      "incendio",
    ])

    // V2: Bag-of-Words para descripción
    const descripcionVector = this.bagOfWords(datosFormulario.descripcion)

    // V3: One-Hot Encoding para ubicación (simplificado)
    const ubicacionTipo = this.determinarTipoUbicacion(datosFormulario.ubicacion)
    const ubicacionVector = this.oneHotEncoding(ubicacionTipo, ["critica", "media", "baja"])

    // V4: Codificación binaria para evidencia
    const evidenciaVector = datosFormulario.tieneEvidencia ? 1 : 0

    // V5: Normalización del historial de reclamos
    const historialNormalizado = this.normalizarHistorial(ubicacionTipo)

    console.log("[v0] Variables codificadas:", {
      tipo: tipoVector,
      descripcion: descripcionVector,
      ubicacion: ubicacionVector,
      evidencia: evidenciaVector,
      historial: historialNormalizado,
    })

    return {
      tipoVector,
      descripcionVector,
      ubicacionVector,
      evidenciaVector,
      historialNormalizado,
    }
  }

  /**
   * PASO 2: SIMULACIÓN DE LA ARQUITECTURA RNA (3 capas del PDF)
   * Capa entrada (16 neuronas) → Capa oculta (8 neuronas) → Capa salida (3 neuronas)
   */
  procesarRNA(variablesCodificadas) {
    console.log("[v0] Procesando datos a través de la RNA simulada")

    // CAPA DE ENTRADA: Combinar todas las variables en un vector de entrada
    const vectorEntrada = [
      ...variablesCodificadas.tipoVector,
      ...variablesCodificadas.descripcionVector,
      ...variablesCodificadas.ubicacionVector,
      variablesCodificadas.evidenciaVector,
      variablesCodificadas.historialNormalizado,
    ]

    // CAPA OCULTA: Simulación de procesamiento con función ReLU
    const salidaCapaOculta = this.aplicarCapaOculta(vectorEntrada)

    // CAPA DE SALIDA: Función Softmax para obtener probabilidades
    const probabilidades = this.aplicarSoftmax(salidaCapaOculta)

    console.log("[v0] Probabilidades calculadas:", probabilidades)

    return probabilidades
  }

  /**
   * PASO 3: CLASIFICACIÓN FINAL
   * Determina la prioridad basándose en las probabilidades
   */
  clasificarPrioridad(datosFormulario) {
    console.log("[v0] Iniciando clasificación mejorada de denuncia")

    // First, apply rule-based scoring for more realistic results
    const scoreBase = this.calcularScoreBase(datosFormulario)

    // Then apply the neural network simulation
    const variablesCodificadas = this.codificarVariables(datosFormulario)
    const probabilidades = this.procesarRNA(variablesCodificadas)

    const probabilidadesAjustadas = this.ajustarConReglas(probabilidades, scoreBase)

    // Determinar la clase con mayor probabilidad
    const prioridades = ["Baja", "Media", "Alta"]
    const indiceMaximo = probabilidadesAjustadas.indexOf(Math.max(...probabilidadesAjustadas))
    const prioridadAsignada = prioridades[indiceMaximo]

    console.log("[v0] Prioridad asignada:", prioridadAsignada)

    return {
      prioridad: prioridadAsignada,
      confianza: Math.round(probabilidadesAjustadas[indiceMaximo] * 100),
      probabilidades: {
        baja: Math.round(probabilidadesAjustadas[0] * 100),
        media: Math.round(probabilidadesAjustadas[1] * 100),
        alta: Math.round(probabilidadesAjustadas[2] * 100),
      },
    }
  }

  // MÉTODOS AUXILIARES PARA CODIFICACIÓN

  oneHotEncoding(valor, categorias) {
    return categorias.map((cat) => (cat === valor ? 1 : 0))
  }

  bagOfWords(descripcion) {
    const palabrasClave = ["emergencia", "peligro", "urgente", "caido", "roto"]
    const descripcionLower = descripcion.toLowerCase()
    return palabrasClave.map((palabra) => (descripcionLower.includes(palabra) ? 1 : 0))
  }

  determinarTipoUbicacion(ubicacion) {
    if (ubicacion.includes("centro") || ubicacion.includes("hospital") || ubicacion.includes("comercial")) {
      return "critica"
    }
    if (ubicacion.includes("industrial") || ubicacion.includes("universitaria")) {
      return "media"
    }
    return "baja" // Zonas residenciales y parques
  }

  normalizarHistorial(tipoUbicacion) {
    const historial = this.historialZonas[tipoUbicacion] || 1
    const maxHistorial = Math.max(...Object.values(this.historialZonas))
    return historial / maxHistorial // Normalizar entre 0 y 1
  }

  // SIMULACIÓN DE CAPAS DE LA RNA

  aplicarCapaOculta(vectorEntrada) {
    // Simulación simplificada de 8 neuronas con función ReLU
    const pesos = [0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.2]
    return pesos.map((peso, i) => {
      const suma = vectorEntrada.reduce((acc, val, j) => acc + val * peso * (j + 1) * 0.1, 0)
      return Math.max(0, suma) // Función ReLU: max(0, x)
    })
  }

  aplicarSoftmax(valores) {
    // Instead of uneven grouping, use a more balanced approach based on the actual neural network logic

    // Calculate weighted scores for each priority class using the hidden layer values
    const scoresBaja = valores[0] * 0.2 + valores[1] * 0.3 + valores[2] * 0.1 // Lower weights for low priority
    const scoresMedia = valores[3] * 0.4 + valores[4] * 0.5 + valores[5] * 0.4 // Medium weights for medium priority
    const scoresAlta = valores[6] * 0.8 + valores[7] * 0.9 // Higher weights for high priority

    const valoresReducidos = [scoresBaja, scoresMedia, scoresAlta]

    const exp = valoresReducidos.map((v) => Math.exp(v))
    const suma = exp.reduce((a, b) => a + b, 0)
    return exp.map((v) => v / suma)
  }

  /**
   * New method to calculate base score using rule-based logic
   */
  calcularScoreBase(datosFormulario) {
    let score = 0

    // Score based on incident type
    const tipoScore = this.pesosEntrada[datosFormulario.tipo] || 0.3
    score += tipoScore

    // Score based on keywords in description
    const descripcionLower = datosFormulario.descripcion.toLowerCase()
    if (descripcionLower.includes("emergencia") || descripcionLower.includes("peligro")) {
      score += 0.4
    } else if (descripcionLower.includes("urgente") || descripcionLower.includes("caido")) {
      score += 0.2
    }

    // Score based on location
    const ubicacionTipo = this.determinarTipoUbicacion(datosFormulario.ubicacion)
    if (ubicacionTipo === "critica") {
      score += 0.3
    } else if (ubicacionTipo === "media") {
      score += 0.1
    }

    // Score based on evidence
    if (datosFormulario.tieneEvidencia) {
      score += 0.1
    }

    return Math.min(score, 1.0) // Cap at 1.0
  }

  /**
   * New method to adjust neural network probabilities with rule-based logic
   */
  ajustarConReglas(probabilidades, scoreBase) {
    // Adjust probabilities based on rule-based score
    const ajustadas = [...probabilidades]

    if (scoreBase > 0.65) {
      // High score should favor "Alta" priority
      ajustadas[2] *= 1.8 // Boost Alta more
      ajustadas[1] *= 0.7 // Reduce Media
      ajustadas[0] *= 0.3 // Reduce Baja significantly
    } else if (scoreBase < 0.45) {
      ajustadas[0] *= 2.0 // Boost Baja significantly
      ajustadas[1] *= 0.6 // Reduce Media more
      ajustadas[2] *= 0.2 // Reduce Alta significantly
    } else {
      // Medium score should favor "Media" priority
      ajustadas[1] *= 1.2 // Boost Media slightly
    }

    // Renormalize
    const suma = ajustadas.reduce((a, b) => a + b, 0)
    return ajustadas.map((v) => v / suma)
  }
}

// Instancia global del clasificador
const clasificadorRNA = new ClasificadorRNA()

/**
 * FUNCIÓN PRINCIPAL PARA USAR DESDE EL FORMULARIO
 */
function clasificarDenuncia(datosFormulario) {
  console.log("[v0] Iniciando clasificación de denuncia")
  return clasificadorRNA.clasificarPrioridad(datosFormulario)
}

/**
 * FUNCIÓN ESPECIAL PARA GARANTIZAR PRIORIDAD BAJA (solo para testing)
 */
function crearEjemploBajaGarantizada() {
  return {
    tipo: "ruido",
    descripcion: "Música en casa vecina por la tarde",
    ubicacion: "parque-residencial-norte",
    tieneEvidencia: false,
  }
}

/**
 * Added function to test classification with guaranteed low priority
 */
function probarClasificacionBaja() {
  const ejemplo = crearEjemploBajaGarantizada()
  const resultado = clasificarDenuncia(ejemplo)
  console.log("[v0] Ejemplo baja garantizada:", ejemplo)
  console.log("[v0] Resultado:", resultado)
  return resultado
}
