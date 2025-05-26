// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Función para actualizar la interfaz según el estado de autenticación
function updateAuthUI() {
    const token = getCookie('token');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {
        // Si el token existe, muestra "Log Out" y oculta "Log In"
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        // Si no existe, muestra "Log In" y oculta "Log Out"
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}

// Ejecuta al cargar la página
window.onload = updateAuthUI;