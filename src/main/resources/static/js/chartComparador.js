const API_URL = "https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,VOLUME,CHANGE,TOPLIST_RANK&toplist_quote_asset=USD";
let chartInstance = null;

async function loadCryptos() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const lista = data?.Data?.LIST;

        if (!lista || !Array.isArray(lista)) {
            showError("No se pudo cargar la lista de criptomonedas.");
            return;
        }

        populateSelect("cripto1", lista, 0); // Bitcoin por defecto
        const ethIndex = lista.findIndex(c => c.SYMBOL === 'ETH');
        populateSelect("cripto2", lista, ethIndex); // Ethereum por defecto

    } catch (err) {
        showError("Error al cargar criptos: " + err.message);
    }
}

function populateSelect(selectId, coins, selectedIndex = 0) {
    const select = document.getElementById(selectId);
    select.innerHTML = "";

    coins.forEach((coin, i) => {
        const option = document.createElement("option");
        option.value = coin.SYMBOL;
        option.textContent = coin.NAME;
        if (i === selectedIndex) option.selected = true;
        select.appendChild(option);
    });
}

async function getRendimientoPorcentual(symbol, fecha) {
    const fechaObj = new Date(fecha);
    const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=200`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo obtener el historial de precios.");
    const data = await response.json();
    const precios = data?.Data?.Data;
    if (!Array.isArray(precios)) throw new Error("Datos de precios inválidos.");

    const rendimiento = [];
    let precioInicio = null;

    for (let punto of precios) {
        const dia = new Date(punto.time * 1000);
        if (dia >= fechaObj) {
            if (precioInicio === null) {
                precioInicio = punto.open;
            }
            const rendimientoAcumulado = ((punto.close - precioInicio) / precioInicio) * 100;
            rendimiento.push({
                fecha: dia.toISOString().split("T")[0],
                rendimiento: rendimientoAcumulado
            });
        }
    }

    if (!rendimiento.length) {
        throw new Error("No hay datos desde la fecha seleccionada.");
    }

    return rendimiento;
}

async function compararYMostrar(symbol, containerId, fecha) {
    const rendimientos = await getRendimientoPorcentual(symbol, fecha);
    const inicio = rendimientos[0];
    const fin = rendimientos[rendimientos.length - 1];

    const container = document.getElementById(containerId);
    container.innerHTML = `
    <h3>${symbol}</h3>
    <p><strong>Desde:</strong> ${inicio.fecha}</p>
    <p><strong>Rendimiento actual:</strong> ${fin.rendimiento.toFixed(2)}%</p>
  `;
    container.style.display = "block";

    return rendimientos;
}

function renderGrafico(data1, label1, data2, label2) {
    const canvas = document.getElementById("graficoComparacion");
    canvas.style.display = "block";

    const etiquetas = data1.map(p => p.fecha);
    const valores1 = data1.map(p => p.rendimiento);
    const valores2 = data2.map(p => p.rendimiento);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [
                {
                    label: label1,
                    data: valores1,
                    borderColor: '#00fff7',
                    backgroundColor: '#00fff7',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: label2,
                    data: valores2,
                    borderColor: '#ff00f7',
                    backgroundColor: '#ff00f7',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#fff"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#fff" },
                    grid: { display: false },
                    title: {
                        display: true,
                        text: "Fecha",
                        color: "#fff"
                    }
                },
                y: {
                    ticks: { color: "#fff" },
                    grid: { display: false },
                    title: {
                        display: true,
                        text: "Rendimiento (%)",
                        color: "#fff"
                    }
                }
            }
        }
    });
}

function showError(msg) {
    const errorDiv = document.getElementById("error");
    errorDiv.textContent = msg;
    errorDiv.style.display = "block";
}

document.getElementById("compararBtn").addEventListener("click", async () => {
    const symbol1 = document.getElementById("cripto1").value;
    const symbol2 = document.getElementById("cripto2").value;
    const fecha = document.getElementById("fecha").value;

    document.getElementById("resultado1").style.display = "none";
    document.getElementById("resultado2").style.display = "none";
    document.getElementById("error").style.display = "none";
    document.getElementById("graficoComparacion").style.display = "none";

    if (!symbol1 || !symbol2 || !fecha) {
        showError("Selecciona ambas criptomonedas y una fecha.");
        return;
    }

    try {
        const data1 = await compararYMostrar(symbol1, "resultado1", fecha);
        const data2 = await compararYMostrar(symbol2, "resultado2", fecha);
        renderGrafico(data1, symbol1, data2, symbol2);
    } catch (err) {
        showError(err.message);
    }
});

window.onload = loadCryptos;