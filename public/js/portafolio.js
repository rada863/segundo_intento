// portafolio.js - Funcionalidades para la página de portafolio

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // FILTRADO DE PROYECTOS
    // ======================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Animación de aparición
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ======================
    // ANIMACIONES AL SCROLL
    // ======================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.portfolio-item, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Configurar observador para animaciones
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.portfolio-item, .testimonial-card').forEach(item => {
        observer.observe(item);
    });

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // ======================
    // MODAL PARA DETALLES DE PROYECTO
    // ======================
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Datos de los proyectos (simulados, en un caso real vendrían de una API)
    const projectsData = {
        'erp-corporativo': {
            title: 'ERP Corporativo',
            category: 'Desarrollo Web',
            description: 'Sistema integral de gestión empresarial desarrollado para una multinacional con presencia en 5 países. La solución incluye módulos de recursos humanos, contabilidad, inventario y CRM.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Redux', 'AWS'],
            client: 'Grupo Empresarial XYZ',
            date: 'Enero 2023',
            images: ['/img/proyecto1.jpg', '/img/proyecto1-extra1.jpg', '/img/proyecto1-extra2.jpg'],
            testimonial: '"El sistema desarrollado por Hydra ha optimizado nuestros procesos en un 40%, reduciendo tiempos y costos operativos." - Carlos Méndez, CEO'
        },
        'fastdelivery': {
            title: 'FastDelivery',
            category: 'Aplicación Móvil',
            description: 'Aplicación de delivery con seguimiento en tiempo real, integración con múltiples restaurantes y sistema de valoración. La app cuenta con más de 50,000 descargas en Play Store.',
            technologies: ['Flutter', 'Firebase', 'Google Maps API', 'Stripe'],
            client: 'FastDelivery Inc.',
            date: 'Marzo 2023',
            images: ['/img/proyecto2.jpg', '/img/proyecto2-extra1.jpg', '/img/proyecto2-extra2.jpg'],
            testimonial: '"La aplicación superó nuestras expectativas en rendimiento y experiencia de usuario. ¡Excelente trabajo!" - Laura Gómez, Directora de Operaciones'
        },
        'fashionstore': {
            title: 'FashionStore',
            category: 'E-commerce',
            description: 'Tienda online de moda con integración de múltiples pasarelas de pago, sistema de recomendación basado en IA y gestión de inventario en tiempo real.',
            technologies: ['Shopify', 'JavaScript', 'PayPal API', 'TensorFlow.js'],
            client: 'FashionStore S.A.',
            date: 'Noviembre 2022',
            images: ['/img/proyecto3.jpg', '/img/proyecto3-extra1.jpg', '/img/proyecto3-extra2.jpg'],
            testimonial: '"Nuestras ventas online aumentaron un 150% después de implementar la nueva plataforma." - Roberto Sánchez, Gerente Comercial'
        }
    };

    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.closest('.portfolio-item').querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const projectData = projectsData[projectId];
            
            if (projectData) {
                const modalBody = modal.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <div class="modal-images">
                        <div class="main-image">
                            <img src="${projectData.images[0]}" alt="${projectData.title}">
                        </div>
                        <div class="thumbnail-container">
                            ${projectData.images.map(img => `
                                <div class="thumbnail">
                                    <img src="${img}" alt="${projectData.title}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-info">
                        <h2>${projectData.title}</h2>
                        <span class="modal-category">${projectData.category}</span>
                        <p class="modal-description">${projectData.description}</p>
                        
                        <div class="modal-details">
                            <div>
                                <h4>Tecnologías</h4>
                                <ul class="tech-list">
                                    ${projectData.technologies.map(tech => `<li>${tech}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <h4>Cliente</h4>
                                <p>${projectData.client}</p>
                                
                                <h4>Fecha</h4>
                                <p>${projectData.date}</p>
                            </div>
                        </div>
                        
                        <div class="modal-testimonial">
                            <p>${projectData.testimonial}</p>
                        </div>
                    </div>
                `;
                
                // Eventos para las miniaturas
                const thumbnails = modal.querySelectorAll('.thumbnail img');
                const mainImage = modal.querySelector('.main-image img');
                
                thumbnails.forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        mainImage.src = thumb.src;
                        thumbnails.forEach(t => t.parentElement.classList.remove('active'));
                        thumb.parentElement.classList.add('active');
                    });
                });
                
                // Mostrar modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Cerrar modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ======================
    // MENÚ MÓVIL
    // ======================
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
});