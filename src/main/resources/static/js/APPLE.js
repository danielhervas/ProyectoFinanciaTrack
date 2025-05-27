
    // Función para obtener los datos de la API
    async function obtenerDatosAAPL() {
    try {
        const response = await fetch("/api/market/aapl");
        const data = await response.json();
    return data;
} catch (error) {
    console.error("Error al obtener datos:", error);
}
}

    // Función para calcular el cambio porcentual entre dos precios
    function calcularCambioAAPL(precioActual, precioAnterior) {
    const cambio = ((precioActual - precioAnterior) / precioAnterior) * 100;
    return cambio.toFixed(2); // Dos decimales
}

    // Función para crear la card usando Bootstrap
    function crearCardAAPL(datos) {
    if (!datos || datos.length < 2) {
    console.error("No hay suficientes datos para calcular el cambio.");
    return;
}

    const registroActual = datos[0];   // Registro más reciente
    const registroAnterior = datos[1];   // Registro del día anterior

    const precioActual = registroActual.price;
    const precioAnterior = registroAnterior.price;
    const cambioPorcentual = calcularCambio(precioActual, precioAnterior);

    // Crear el elemento card usando las clases de Bootstrap
    const card = document.createElement("div");
    card.className = "card mx-auto";
    card.style.maxWidth = "300px";

    // Card header con logo e ícono
    const header = document.createElement("div");
    header.className = "card-header d-flex align-items-center justify-content-between";

    // Logo (usa tu URL manualmente, aquí es un placeholder)
    const logo = document.createElement("img");
    logo.src = "/assets/img/apple_imagen.png";  // logo
    logo.alt = registroActual.symbol + " Logo";
    logo.className = "rounded-circle mr-3";
    logo.style.width = "40px";
    logo.style.height = "40px";

    // Título con el símbolo
    const title = document.createElement("h5");
    title.className = "mb-0";
    title.textContent = registroActual.symbol;

    header.appendChild(logo);
    header.appendChild(title);

    // Card body con precio y cambio porcentual
    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column flex-sm-row justify-content-between align-items-center gap-1";

    const precioElem = document.createElement("h4");
    precioElem.className = "mb-0";
    precioElem.textContent = "$" + precioActual.toFixed(2);

    const cambioElem = document.createElement("span");
    // Agrega signo + para cambio positivo
    cambioElem.textContent = (cambioPorcentual >= 0 ? "+" : "") + cambioPorcentual + "%";
    // Usa clases de Bootstrap para color: text-success para positivo, text-danger para negativo
    cambioElem.className = cambioPorcentual >= 0 ? "text-success" : "text-danger";

    body.appendChild(precioElem);
    body.appendChild(cambioElem);

    // Card footer con el botón "VER GRÁFICO"
    const footer = document.createElement("div");
    footer.className = "card-footer text-right";

    const button = document.createElement("button");
    button.className = "btn btn-sm btn-white text-dark border border-1 rounded mx-auto d-block";
    button.textContent = "VER GRÁFICO";
    button.addEventListener("click", () => {
        window.location.href = "https://es.tradingview.com/symbols/NASDAQ-AAPL/";
    });

    footer.appendChild(button);

    // Agrega las secciones a la card
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    // Inserta la card en el contenedor
    document.getElementById("cardContainer").appendChild(card);
}

    // Ejecuta la obtención de datos y creación de la card
    (async () => {
    const datos = await obtenerDatosAAPL();
    console.log("Datos recibidos:", datos);
    crearCardAAPL(datos);
})();
