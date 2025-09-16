// Credenciales de ejemplo (en un caso real esto estaría en el servidor)
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Verificar si ya hay sesión activa al cargar
if (sessionStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'menu.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const formularioInicioSesion = document.getElementById('formularioInicioSesion');
    const errorInicioSesion = document.getElementById('errorInicioSesion');
    const menuPrincipal = document.getElementById('menuPrincipal');

    formularioInicioSesion.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const contrasena = document.getElementById('contrasena').value;
        
        // Validar credenciales
        if (nombreUsuario === VALID_CREDENTIALS.username && 
            contrasena === VALID_CREDENTIALS.password) {
            
            // Redirigir al menú principal
            window.location.href = 'menu.html';
            
            // Limpiar campos y errores
            formularioInicioSesion.reset();
            errorInicioSesion.style.display = 'none';
            
            // Guardar estado de sesión
            sessionStorage.setItem('isLoggedIn', 'true');
        } else {
            // Mostrar mensaje de error
            errorInicioSesion.style.display = 'block';
            errorInicioSesion.textContent = 'Credenciales incorrectas';
        }
    });

    // Verificar si ya hay una sesión activa
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        document.querySelector('.contenedor-inicio').style.display = 'none';
        mainMenu.style.display = 'block';
    }
});