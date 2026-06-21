// Función para iluminar las rutas específicas del condicional
function moverFlujo(nota) {
    // Los bloques troncales (Inicio, Pregunta y Fin) siempre se quedan en verde exitoso
    document.getElementById("bloque-inicio").classList.add("camino-activo");
    document.getElementById("bloque-pregunta").classList.add("camino-activo");
    document.getElementById("bloque-fin").classList.add("camino-activo");
    
    // Condicional para evaluar los colores de la bifurcación
    if (nota >= 60) {
        // Camino verdadero: Ilumina SÍ en verde y remueve estilos del NO
        document.getElementById("bloque-si").classList.add("camino-activo");
        document.getElementById("bloque-no").classList.remove("camino-falso");
    } else {
        // Camino falso: Ilumina NO en rojo y remueve estilos del SÍ
        document.getElementById("bloque-no").classList.add("camino-falso");
        document.getElementById("bloque-si").classList.remove("camino-activo");
    }
}