let chart; // ApexCharts chart instance

// Insertar CSS para personalizar la toolbar y el menú
const estiloApex = `
  .apexcharts-menu {
    background: #333 !important; /* Fondo oscuro */
    color: #fff !important; /* Texto blanco */
  }
  .apexcharts-menu-item {
    color: #fff !important; /* Texto blanco en las opciones */
  }
  .apexcharts-menu-item:hover {
    background: #444 !important; /* Fondo más oscuro en hover */
  }
  .apexcharts-toolbar {
    background:rgb(255, 255, 255) !important; /* Fondo oscuro en la toolbar */
  }
`;

// Crear e insertar el <style>
const styleTag = document.createElement('style');
styleTag.innerHTML = estiloApex;
document.head.appendChild(styleTag);

function abrirGrafico(symbol) {
    const tipo = "histoday"; // valor inicial
    obtenerDatosYRenderizarGrafico(symbol, tipo);
    document.getElementById("cryptoSymbol").innerText = symbol;
    const modal = new bootstrap.Modal(document.getElementById('graficoModal'));
    modal.show();
}

function obtenerDatosYRenderizarGrafico(symbol, tipo) {
    const url = `https://min-api.cryptocompare.com/data/v2/${tipo}?fsym=${symbol}&tsym=USD&limit=100`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.Response !== "Success") {
                alert("No se pudo cargar el gráfico.");
                return;
            }

            const seriesData = data.Data.Data.map(punto => {
                return {
                    x: new Date(punto.time * 1000),
                    y: [punto.open, punto.high, punto.low, punto.close]
                };
            });

            const options = {
                chart: {
                    type: 'candlestick',
                    height: 350,
                    background: '#1e1e1e',
                    toolbar: {
                        show: true, // puedes ocultarlo si no lo quieres
                    }
                },
                series: [{
                    name: "Precio", // necesario para que aparezca la leyenda
                    data: seriesData
                }],
                tooltip: {
                    theme: 'dark' // fondo negro y texto blanco
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'center',
                    labels: {
                        colors: '#fff',
                        useSeriesColors: false
                    },
                    fontWeight: 700
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            colors: '#fff'
                        }
                    }
                },
                yaxis: {
                    tooltip: {
                        enabled: true
                    },
                    labels: {
                        style: {
                            colors: '#fff'
                        }
                    }
                }
            };

            if (chart) {
                chart.updateOptions(options);
            } else {
                chart = new ApexCharts(document.querySelector("#chart"), options);
                chart.render();
            }
        })
        .catch(err => {
            console.error("Error cargando datos del gráfico:", err);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnDia").addEventListener("click", () => {
        const symbol = document.getElementById("cryptoSymbol").innerText;
        obtenerDatosYRenderizarGrafico(symbol, "histoday");
    });
    document.getElementById("btnHora").addEventListener("click", () => {
        const symbol = document.getElementById("cryptoSymbol").innerText;
        obtenerDatosYRenderizarGrafico(symbol, "histohour");
    });
    document.getElementById("btnMinuto").addEventListener("click", () => {
        const symbol = document.getElementById("cryptoSymbol").innerText;
        obtenerDatosYRenderizarGrafico(symbol, "histominute");
    });
});
