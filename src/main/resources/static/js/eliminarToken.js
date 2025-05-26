function logout() {
    // Elimina la cookie 'token'
    document.cookie = 'token=; Max-Age=0; path=/';

    // Redirige al usuario a la página de inicio
    window.location.href = '/inicio';
}