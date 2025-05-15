const API_URL = "https://data-api.coindesk.com/asset/v1/top/list";
let allCoins = [];
let filteredCoins = [];
let currentPage = 1;
const pageSize = 12;

function loadCryptos() {
    const url = `${API_URL}?page=1&page_size=100&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,VOLUME,CHANGE,TOPLIST_RANK&toplist_quote_asset=USD`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.Data || !data.Data.LIST) {
                document.getElementById("crypto-list").innerHTML = "<p class='text-danger'>No se pudieron cargar los datos.</p>";
                return;
            }

            allCoins = data.Data.LIST;
            filteredCoins = allCoins; // al principio se muestran todas
            renderPage();
        })
        .catch(error => {
            console.error("Error al cargar criptos:", error);
            document.getElementById("crypto-list").innerHTML = "<p class='text-danger'>Error al obtener datos.</p>";
        });
}

function renderPage() {
    const list = document.getElementById("crypto-list");
    list.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const coinsToShow = filteredCoins.slice(start, end);

    coinsToShow.forEach(coin => {
        const name = coin.NAME || "Desconocido";
        const symbol = coin.SYMBOL || "";
        const price = coin.PRICE_USD?.toFixed(2) || "N/A";
        const marketCap = coin.CIRCULATING_MKT_CAP_USD || 0;
        const logo = coin.LOGO_URL || "";
        const change24h = coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD;
        const changeFormatted = (change24h !== undefined && change24h !== null)
            ? `${change24h.toFixed(2)}%`
            : "N/A";

        list.innerHTML += `
          <div class="col-md-6 col-lg-4 crypto-card">
            <div class="card shadow h-100 border rounded-4 bg-light text-dark">
              <div class="card-body h-100">
                <div class="d-flex align-items-center mb-3">
                  ${logo ? `<img src="${logo}" alt="${name}" class="me-2" style="height: 32px; width: 32px; object-fit: contain;">` : ""}
                  <h5 class="card-title mb-0 fw-bold">${name} <small class="text-muted">(${symbol})</small></h5>
                </div>
                <p>💰 <strong>Precio:</strong> <span class="fw-bold">$${price}</span></p>
                <p>🏦 <strong>Market Cap:</strong> $${(marketCap / 1e9).toFixed(2)} B</p>
                <p>📉 <strong>Cambio 24h:</strong> <span style="color:${change24h > 0 ? 'green' : (change24h < 0 ? 'red' : 'black')}">${changeFormatted}</span></p>
                <p class="mt-3 text-end text-center pt-2">
                  <button class="btn btn-success rounded-4 btn-ver-grafico" data-symbol="${symbol}">
                    Ver gráfico
                  </button>
                </p>
              </div>
            </div>
          </div>`;
    });


    setupPagination();

    document.querySelectorAll(".btn-ver-grafico").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const symbol = e.currentTarget.getAttribute("data-symbol");
            abrirGrafico(symbol); // función que está en chart.js
        });
    });

}

function setupPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredCoins.length / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault(); changePage(${i})">${i}</a>
      </li>`;
    }
}

function changePage(page) {
    currentPage = page;
    renderPage();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCryptos();

    document.getElementById("searchInput").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        filteredCoins = allCoins.filter(coin => {
            const name = coin.NAME?.toLowerCase() || "";
            const symbol = coin.SYMBOL?.toLowerCase() || "";
            return name.includes(searchTerm) || symbol.includes(searchTerm);
        });

        currentPage = 1; // reset a la primera página
        renderPage();
    });
});

