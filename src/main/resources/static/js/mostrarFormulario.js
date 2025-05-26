function mostrarFormulario(formulario) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');

    if (formulario === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';

        btnLogin.classList.add('btn-success-custom', 'text-success-custom');
        btnLogin.classList.remove('btn-outline-light');
        btnRegister.classList.remove('btn-success-custom', 'text-success-custom');
        btnRegister.classList.add('btn-outline-light');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';

        btnRegister.classList.add('btn-success-custom', 'text-success-custom');
        btnRegister.classList.remove('btn-outline-light');
        btnLogin.classList.remove('btn-success-custom', 'text-success-custom');
        btnLogin.classList.add('btn-outline-light');
    }
}
