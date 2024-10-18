
const API_URL = 'https://firestore.googleapis.com/v1/projects/{Productos}/databases/(default)/documents/products'; 


const carouselItemsContainer = document.getElementById('carouselItems');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const subscribeForm = document.getElementById('subscribeForm');
const emailInput = document.getElementById('email');
const validationMessage = document.getElementById('validationMessage');

let currentIndex = 0;
let products = [];

// Función para obtener productos de la API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error en la carga de productos');
        products = await response.json();
        renderCarousel();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para renderizar el carrusel
function renderCarousel() {
    carouselItemsContainer.innerHTML = '';

    products.forEach(product => {
        const averageTag = getAverageTag(product.tags);
        const stars = getStarRating(averageTag);
        
        const productItem = document.createElement('div');
        productItem.classList.add('carousel-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Rating: ${stars} (${averageTag})</p>
        `;
        carouselItemsContainer.appendChild(productItem);
    });

    updateCarousel();
}

// Calcular el promedio de las etiquetas
function getAverageTag(tags) {
    const numericalTags = tags.map(tag => parseInt(tag)).filter(tag => !isNaN(tag));
    const sum = numericalTags.reduce((acc, tag) => acc + tag, 0);
    return Math.round(sum / numericalTags.length) || 0; // Promedio, o 0 si no hay etiquetas
}

// Obtener la calificación en estrellas
function getStarRating(tag) {
    if (tag >= 0 && tag < 100) return '⭐';
    if (tag < 200) return '⭐⭐';
    if (tag < 300) return '⭐⭐⭐';
    if (tag < 400) return '⭐⭐⭐⭐';
    return '⭐⭐⭐⭐⭐';
}

// Navegación del carrusel
function updateCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        item.style.display = (index === currentIndex) ? 'block' : 'none';
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : products.length - 1;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < products.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
});

// Validación del correo electrónico
subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailValue = emailInput.value;

    // Regex para validar el formato del correo
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    
    if (!emailPattern.test(emailValue)) {
        validationMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
        validationMessage.classList.remove('hidden');
    } else {
        validationMessage.classList.add('hidden');
        alert('¡Gracias por suscribirte!');
        emailInput.value = '';
    }
});


fetchProducts();
