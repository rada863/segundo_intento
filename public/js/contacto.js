
// contacto.js - Funcionalidades para la página de contacto

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // MAPA LEAFLET
    // ======================
    const map = L.map('map').setView([-34.6037, -58.3816], 15); // Coordenadas de Buenos Aires
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([-34.6037, -58.3816]).addTo(map)
        .bindPopup('Oficinas de Hydra<br>Av. Tecnológica 1234')
        .openPopup();
    
    // ======================
    // FORMULARIO DE CONTACTO
    // ======================
    

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar loader
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked
        };
        
        try {
            // Enviar datos al servidor
            const response = await fetch('/enviar-mensaje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Mostrar mensaje de éxito
                showAlert('success', data.message);
                contactForm.reset();
            } else {
                // Mostrar mensaje de error
                showAlert('error', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('error', 'Ocurrió un error al enviar tu mensaje. Por favor inténtalo de nuevo más tarde.');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Función para mostrar alertas
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Estilos para las alertas (puedes personalizar)
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '15px 25px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.color = 'white';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.animation = 'fadeIn 0.3s ease forwards';
    
    if (type === 'success') {
        alertDiv.style.background = '#4CAF50'; // Verde
    } else {
        alertDiv.style.background = '#F44336'; // Rojo
    }
    
    document.body.appendChild(alertDiv);
    
    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 5000);
}
    // ======================
    // MENÚ MÓVIL
    // ======================
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (burger) burger.classList.remove('active');
        });
    });
    
    // ======================
    // ANIMACIONES AL SCROLL
    // ======================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.team-member, .info-item, .form-group');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configurar animaciones iniciales
    document.querySelectorAll('.team-member, .info-item, .form-group').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});