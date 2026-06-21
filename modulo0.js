document.addEventListener("DOMContentLoaded", function() {
    
    let selCajero = document.getElementById("selector-cajero");
    let selCarro = document.getElementById("selector-carro");
    let selRed = document.getElementById("selector-red");

    let botones = [
        document.getElementById("btn-instruccion1"), document.getElementById("btn-instruccion2"),
        document.getElementById("btn-instruccion3"), document.getElementById("btn-instruccion4"),
        document.getElementById("btn-instruccion5"), document.getElementById("btn-instruccion6"),
        document.getElementById("btn-instruccion7"), document.getElementById("btn-instruccion8")
    ];
    
    let btnReiniciar = document.getElementById("btn-reiniciar");
    let consola = document.getElementById("salida-consola");
    let panelCamino = document.getElementById("registro-camino");

    let ejercicioActual = "cajero";
    let historialPasos = [];
    let terminado = false;

    // Banderas de control de estado secuencial
    let pasoTarjeta = false, pasoNip = false, pasoSaldo = false, pasoMonto = false;
    let pasoClutch = false, pasoNeutral = false, pasoLlave = false, pasoPrimera = false;
    let pasoDatos = false, pasoBotonEnvio = false, pasoRecibirSms = false, pasoEscribirSms = false;

    const bancoRetos = {
        cajero: {
            pasos: [
                "Insertar la tarjeta bancaria en la ranura lectora del cajero",
                "Digitar el NIP privado de seguridad de 4 números usando el teclado",
                "Consultar saldo actual en pantalla para verificar fondos disponibles",
                "Seleccionar la opción de retiro de efectivo de las alternativas en pantalla",
                "Ingresar el monto exacto de $500 y confirmar la transacción",
                "Retirar los billetes distribuidos y recoger la tarjeta expulsada"
            ],
            trampas: [
                "Presionar el botón físico de 'Cancelar' para limpiar la pantalla de inicio",
                "Digitar los 16 dígitos frontales de la tarjeta de débito en el teclado"
            ]
        },
        carro: {
            pasos: [
                "Presionar a fondo el pedal del embrague (clutch) con el pie izquierdo",
                "Mover la palanca de cambios y colocarla en la posición de Neutral",
                "Girar la llave de encendido por completo para activar el motor",
                "Mover la palanca a Primera velocidad manteniendo el pedal abajo",
                "Presionar suavemente el acelerador mientras se suelta el embrague poco a poco"
            ],
            trampas: [
                "Girar la llave de encendido por segunda vez para verificar la marcha",
                "Presionar el pedal de freno intermitentemente para bombear el líquido",
                "Mover la palanca de cambios directamente a la posición de Reversa"
            ]
        },
        red: {
            pasos: [
                "Introducir el correo electrónico y la contraseña en los campos de texto",
                "Dar clic en el botón de 'Iniciar Sesión' para procesar tus datos",
                "Recibir la notificación automatizada con el código SMS en tu celular",
                "Escribir los 6 dígitos del código SMS dentro del campo de doble factor",
                "Esperar la carga del perfil y acceder al muro principal de la aplicación"
            ],
            trampas: [
                "Presionar el botón de 'Actualizar Página' (F5) para agilizar la respuesta",
                "Dar clic en el enlace '¿Olvidaste tu contraseña?' para comprobar identidad",
                "Solicitar reenvío de un segundo código de verificación SMS de forma inmediata"
            ]
        }
    };

    function mezclarOpciones(arreglo) {
        for (let i = arreglo.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let t = arreglo[i]; arreglo[i] = arreglo[j]; arreglo[j] = t;
        }
        return arreglo;
    }

    function cargarTextosEjercicio() {
        let datos = bancoRetos[ejercicioActual];
        let todasOp = [...datos.pasos, ...datos.trampas];
            
        let listaMezclada = mezclarOpciones([...todasOp]);
        botones.forEach((btn, idx) => { 
            btn.innerText = `🔹 ${listaMezclada[idx]}`; 
        });
        resetearLaboratorio();
    }

    function resetearLaboratorio() {
        historialPasos = []; terminado = false;
        pasoTarjeta = pasoNip = pasoSaldo = pasoMonto = false;
        pasoClutch = pasoNeutral = pasoLlave = pasoPrimera = false;
        pasoDatos = pasoBotonEnvio = pasoRecibirSms = pasoEscribirSms = false;

        consola.innerHTML = `<p style="color: #8a99ad; margin: 0;">Consola: Sistema en espera. Selecciona tu primer paso con cuidado...</p>`;
        panelCamino.innerHTML = `<em>Ninguna instrucción ejecutada todavía.</em>`;
        botones.forEach(btn => { btn.disabled = false; btn.classList.remove("ejecutado"); });
    }

    function desactivarSistema() {
        botones.forEach(btn => { btn.disabled = true; btn.classList.add("ejecutado"); });
    }

    function registrarPaso(texto) {
        historialPasos.push(texto);
        panelCamino.innerHTML = historialPasos.map((p, i) => `<div><strong>Paso ${i + 1}:</strong> ${p}</div>`).join("");
    }

    function evaluarInstruccion(btn) {
        if (terminado) return;
        let txt = btn.innerText.replace("🔹 ", "").trim();
        btn.disabled = true; btn.classList.add("ejecutado");
        registrarPaso(txt);

        let r = bancoRetos[ejercicioActual];

        // --- RETO CAJERO AUTOMÁTICO ---
        if (ejercicioActual === "cajero") {
            if (txt === r.trampas[0]) { // Cancelar
                terminado = true; desactivarSistema();
                consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Presionaste 'Cancelar'. El algoritmo detuvo el flujo del procesador de forma inmediata devolviendo los valores a cero.</p>`;
                return;
            }
            if (txt === r.trampas[1]) { // 16 dígitos
                terminado = true; desactivarSistema();
                consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Confundiste el número de plástico con tu clave NIP. El sistema bloqueó los intentos por desbordamiento de datos.</p>`;
                return;
            }
            if (txt === r.pasos[0]) { // Insertar tarjeta
                pasoTarjeta = true;
                consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Tarjeta retenida en ranura. Esperando credenciales de acceso.</p>`;
                return;
            }
            if (txt === r.pasos[1]) { // Digitar NIP
                if (pasoTarjeta) { 
                    pasoNip = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Acceso concedido al menú principal de movimientos.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste digitar una clave sin haber ingresado una tarjeta de datos antes. El procesador no tiene un registro al cual asignarle la orden.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[2]) { // Consultar saldo
                if (pasoTarjeta && pasoNip) { 
                    pasoSaldo = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Fondos disponibles: $1,200. Regresando al menú de opciones...</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste consultar un saldo del servidor sin autenticación activa. El firewall del backend rechazó la petición.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[3]) { // Opción de retiro
                if (pasoTarjeta && pasoNip) { 
                    pasoMonto = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Abriendo canal del dispensador físico de billetes.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>No puedes abrir un menú de retiro si el sistema no sabe a qué cuenta acceder. Te saltaste la autenticación.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[4]) { // Ingresar monto
                if (pasoTarjeta && pasoNip && pasoMonto) { 
                    pasoMonto = "confirmado"; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Cantidad aprobada y descontada temporalmente. Preparando salida física.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Ingresaste una cantidad de retiro fuera de un menú de transacción. El procesador no tiene un contexto para aplicar el número.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[5]) { // Retirar billetes
                if (pasoTarjeta && pasoNip && pasoMonto === "confirmado") {
                    terminado = true; desactivarSistema();
                    let t = pasoSaldo ? "CAMINO ALTERNATIVO (Largo/Precavido)" : "CAMINO DIRECTO (Óptimo/Paso Mínimo)";
                    consola.innerHTML = `<h3 style='color:#10b981;'>ÉXITO</h3><p><strong>Ruta realizada con éxito:</strong> ${t}. Lograste el retiro de forma segura y finita. La sesión ha sido cerrada correctamente.</p>`;
                } else {
                    terminado = true; desactivarSistema();
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste meter la mano al dispensador de billetes sin haber validado ni aprobado un monto previo. El sistema bloqueó la cortina por seguridad.</p>`;
                }
                return;
            }
        }

        // --- RETO ENCENDIDO DE CARRO ---
        if (ejercicioActual === "carro") {
            if (txt === r.trampas[0] || txt === r.trampas[1] || txt === r.trampas[2]) {
                terminado = true; desactivarSistema();
                consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Omitiste desembragar o activaste un sistema innecesario fuera de tiempo. Forzaste la caja de cambios o la marcha y el motor colapsó.</p>`;
                return;
            }
            if (txt === r.pasos[0]) { // Clutch
                pasoClutch = true; 
                consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Transmisión separada físicamente del giro de fuerza del motor.</p>`;
                return;
            }
            if (txt === r.pasos[1]) { // Neutral
                if (pasoClutch) { 
                    pasoNeutral = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Engranes de velocidad liberados. Palanca en centro.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Forzaste la palanca a Neutral sin cortar la fuerza con el clutch. Los dientes del varillaje se barrieron por completo.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[2]) { // Llave encendido
                if (pasoClutch && pasoNeutral) { 
                    pasoLlave = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Combustión estable. Bloque a ralentí esperando tracción.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Diste marcha dejando una velocidad puesta y sin pisar el embrague. El auto dio un tirón violento y se mató al instante.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[3]) { // Primera velocidad
                if (pasoClutch && pasoNeutral && pasoLlave) { 
                    pasoPrimera = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Caja lista para transmitir torque a las ruedas frontales.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste meter velocidad con el motor apagado o sin desacoplar los discos de giro. La palanca está trabada.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[4]) { // Acelerar y soltar clutch
                if (pasoClutch && pasoNeutral && pasoLlave && pasoPrimera) {
                    terminado = true; desactivarSistema();
                    consola.innerHTML = `<h3 style='color:#10b981;'>ÉXITO</h3><p><strong>Ruta Óptima completada:</strong> Clutch ➡️ Neutral ➡️ Encendido ➡️ Primera ➡️ Despegue. Transferencia de fuerzas mecánicas completada con éxito.</p>`;
                } else {
                    terminado = true; desactivarSistema();
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Soltaste el pedal del clutch antes de encender el coche o sin haber engranado la primera marcha. El bloque se apagó por completo.</p>`;
                }
                return;
            }
        }

        // --- RETO INICIO DE SESIÓN WEB (RED SOCIAL) ---
        if (ejercicioActual === "red") {
            if (txt === r.trampas[0] || txt === r.trampas[1] || txt === r.trampas[2]) {
                terminado = true; desactivarSistema();
                consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Interrumpiste la petición de red enviando comandos duplicados o desviando el flujo a otra página. El servidor bloqueó la IP por seguridad.</p>`;
                return;
            }
            if (txt === r.pasos[0]) { // Introducir datos
                pasoDatos = true; 
                consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Credenciales guardadas de forma local en la memoria de la interfaz.</p>`;
                return;
            }
            if (txt === r.pasos[1]) { // Clic Iniciar Sesión
                if (pasoDatos) { 
                    pasoBotonEnvio = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Información empaquetada y enviada a los servidores centrales de validación.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Enviaste una petición de acceso completamente vacía al backend. El sistema manifestó una excepción de nulos.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[2]) { // Recibir SMS
                if (pasoDatos && pasoBotonEnvio) { 
                    pasoRecibirSms = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Llave token generada y enviada al dispositivo enlazado con la cuenta.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>El servidor no puede generar un código de verificación SMS si no sabe a qué cuenta del sistema quieres acceder.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[3]) { // Escribir SMS
                if (pasoDatos && pasoBotonEnvio && pasoRecibirSms) { 
                    pasoEscribirSms = true; 
                    consola.innerHTML = `<h3 style="color: #00a2ff; margin: 0 0 5px 0;">ÉXITO</h3><p>Doble factor aprobado en backend. Generando cookies de sesión de forma segura.</p>`; 
                } else { 
                    terminado = true; desactivarSistema(); 
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste escribir un código en una caja de texto que aún no se dibuja en el navegador porque no has disparado el flujo inicial.</p>`; 
                }
                return;
            }
            if (txt === r.pasos[4]) { // Carga del perfil
                if (pasoDatos && pasoBotonEnvio && pasoRecibirSms && pasoEscribirSms) {
                    terminado = true; desactivarSistema();
                    consola.innerHTML = `<h3 style='color:#10b981;'>ÉXITO</h3><p><strong>Ruta de acceso completada con éxito:</strong> Inputs ➡️ Envío POST ➡️ Generar Token ➡️ Validar SMS ➡️ Renderizado. Acceso al perfil concedido correctamente.</p>`;
                } else {
                    terminado = true; desactivarSistema();
                    consola.innerHTML = `<h3 style="color: #ef4444; margin: 0 0 5px 0;">ERROR</h3><p>Intentaste brinar directo al muro saltándote los filtros intermedios obligatorios. El cortafuegos del servidor te rechazó por falta de firmas digitales.</p>`;
                }
                return;
            }
        }
    }

    function conmutarReto(btnActivo, idReto) {
        selCajero.classList.remove("activo"); selCarro.classList.remove("activo"); selRed.classList.remove("activo");
        btnActivo.classList.add("activo"); ejercicioActual = idReto; cargarTextosEjercicio();
    }

    selCajero.addEventListener("click", () => conmutarReto(selCajero, "cajero"));
    selCarro.addEventListener("click", () => conmutarReto(selCarro, "carro"));
    selRed.addEventListener("click", () => conmutarReto(selRed, "red"));
    btnReiniciar.addEventListener("click", resetearLaboratorio);

    botones.forEach(btn => { btn.addEventListener("click", () => evaluarInstruccion(btn)); });

    cargarTextosEjercicio();
});