// Toma el valor que escribe el alumno y lo copia en las tres secciones
function cambiarValor() {
    let caja = document.getElementById("numero-ingresado").value;
    
    // Si borran todo, ponemos un cero para que no se vea vacío
    if (caja === "") {
        caja = 0;
    }
    
    document.getElementById("ver-algebra").innerText = caja;
    document.getElementById("ver-java").innerText = caja;
    document.getElementById("ver-ram").innerText = caja;
}