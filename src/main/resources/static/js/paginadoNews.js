document.addEventListener("DOMContentLoaded", function () {
    const carouselInner   = document.getElementById("carousel-inner");
    const newsContainer   = document.getElementById("news-container");
    const paginationNav   = document.getElementById("pagination-nav");

    const pageSize = 9;       // Noticias por página
    let currentPage = 1;
    let allNews = [];

    fetch("https://data-api.coindesk.com/news/v1/article/list?limit=100&lang=ES")
        .then(resp => resp.json())
        .then(data => {
            allNews = data.Data;
            renderCarousel(allNews.slice(0, 5));
            setupPagination(allNews.slice(5));
            renderPage(1);
        })
        .catch(err => console.error("Error al cargar las noticias:", err));

    // Renderiza el carrusel
    function renderCarousel(items) {
        items.forEach((item, i) => {
            const div = document.createElement("div");
            div.className = `carousel-item ${i===0?"active":""} h-100`;
            div.innerHTML = `
          <div class="d-flex justify-content-center">
                <div class="card h-100 d-flex flex-column" style="width: 80%;">
                  <img src="${item.IMAGE_URL}" class="card-img-top" alt="${item.TITLE}">
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.TITLE}</h5>
                    <p class="card-text">${item.BODY.slice(0, 150)}...</p>
                    <div class="d-flex justify-content-center mt-auto">
                      <a href="${item.URL}" class="btn btn-success rounded-4" target="_blank">Leer más</a>
                    </div>
                  </div>
                </div>
              </div>
        `;
            carouselInner.appendChild(div);
        });
    }

    // Configura los botones de paginación
    function setupPagination(items) {
        const totalPages = Math.ceil(items.length / pageSize);
        paginationNav.innerHTML = "";

        // Prev
        paginationNav.appendChild(createPageItem("«", currentPage > 1, () => changePage(currentPage - 1)));

        // Páginas
        for (let p = 1; p <= totalPages; p++) {
            const isActive = p === currentPage;
            paginationNav.appendChild(createPageItem(p, true, () => changePage(p), isActive));
        }

        // Next
        paginationNav.appendChild(createPageItem("»", currentPage < totalPages, () => changePage(currentPage + 1)));
    }

    // Helper para crear un <li> de paginación
    function createPageItem(label, enabled, onClick, isActive = false) {
        const li = document.createElement("li");
        li.className = `page-item ${!enabled?"disabled":""} ${isActive?"active":""}`;
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.innerText = label;
        if (enabled) a.addEventListener("click", e => { e.preventDefault(); onClick(); });
        li.appendChild(a);
        return li;
    }

    // Cambia de página y vuelve a renderizar grid y paginación
    function changePage(page) {
        currentPage = page;
        renderPage(page);
        setupPagination(allNews.slice(5));
        window.scrollTo({ top: 0, behavior: "smooth" }); // ← aquí
    }


    // Renderiza una página concreta del grid
    function renderPage(page) {
        const start = 5 + (page - 1) * pageSize;
        const end   = start + pageSize;
        const items = allNews.slice(start, end);

        newsContainer.innerHTML = "";
        items.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-6 col-xl-4 mb-4";
            col.innerHTML = `
          <div class="card h-100 d-flex flex-column">
                <img src="${item.IMAGE_URL}" class="card-img-top" alt="${item.TITLE}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${item.TITLE}</h5>
                  <p class="card-text">${item.BODY.slice(0, 150)}...</p>
                  <div class="d-flex justify-content-center mt-auto">
                    <a href="${item.URL}" class="btn btn-success rounded-4" target="_blank">Leer más</a>
                  </div>
                </div>
              </div>
        `;
            newsContainer.appendChild(col);
        });
    }

});