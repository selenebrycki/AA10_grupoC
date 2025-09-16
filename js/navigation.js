document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const sections = {
        mainMenu: document.getElementById('mainMenu'),
        reportForm: document.getElementById('reportForm'),
        statusCheck: document.getElementById('statusCheck'),
        notifications: document.getElementById('notifications'),
        operadores: document.getElementById('operadores'),
        areas: document.getElementById('areas'),
        usuarios: document.getElementById('usuarios')
    };

    // Función para mostrar una sección y ocultar las demás
    function showSection(sectionId) {
        Object.keys(sections).forEach(key => {
            if (sections[key]) {
                sections[key].style.display = key === sectionId ? 'block' : 'none';
            }
        });
    }

    // Manejador de la navegación
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'mainMenu';
        showSection(hash);
    });

    // Evento para el botón de cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('isLoggedIn');
        window.location.hash = '';
        document.querySelector('.login-container').style.display = 'block';
        showSection('mainMenu');
    });

    // Inicializar formulario de reporte
    const incidentForm = document.getElementById('incidentForm');
    if (incidentForm) {
        incidentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Reporte enviado con éxito');
            window.location.hash = 'mainMenu';
        });
    }

    // Inicializar filtros de búsqueda
    const filterInput = document.getElementById('filterDenuncias');
    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#denunciasList tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Manejador de notificaciones
    document.querySelectorAll('.notification-item button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            item.classList.remove('unread');
            e.target.disabled = true;
            e.target.textContent = 'Leída';
        });
    });

    // Manejadores para las tablas de gestión
    function initManagementTable(tableId) {
        const table = document.getElementById(tableId);
        if (table) {
            table.addEventListener('click', (e) => {
                if (e.target.classList.contains('edit-btn')) {
                    const row = e.target.closest('tr');
                    const id = row.cells[0].textContent;
                    alert(`Editando registro ${id}`);
                } else if (e.target.classList.contains('delete-btn')) {
                    const row = e.target.closest('tr');
                    const id = row.cells[0].textContent;
                    if (confirm(`¿Está seguro de eliminar el registro ${id}?`)) {
                        row.remove();
                    }
                }
            });
        }
    }

    // Inicializar tablas de gestión
    ['operadoresTable', 'areasTable', 'usuariosTable'].forEach(initManagementTable);
});