import '../css/style.css';

// Глобальные переменные для управления перетаскиванием
let draggedCard = null;
let placeholder = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    const columns = document.querySelectorAll('.column');

    // Инициализация кнопок добавления карточек
    document.querySelectorAll('.add-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = prompt('Enter card text:');
            if (text && text.trim()) {
                const container = btn.previousElementSibling;
                createCard(text.trim(), container);
            }
        });
    });

    // Инициализация событий перетаскивания для колонок
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
    });

    // Добавляем начальные карточки
    initializeSampleCards();

    // Добавляем обработчики для существующих карточек
    initializeCardEvents();
}

function createCard(text, container) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.textContent = text;
    
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-card';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.remove();
    });
    
    card.appendChild(deleteBtn);
    
    // Добавляем обработчики событий перетаскивания
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    container.appendChild(card);
    return card;
}

function initializeCardEvents() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        
        const deleteBtn = card.querySelector('.delete-card');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.remove();
            });
        }
    });
}

function handleDragStart(e) {
    draggedCard = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    
    // Создаем плейсхолдер
    placeholder = document.createElement('div');
    placeholder.className = 'card-placeholder';
    
    // Добавляем небольшую задержку для лучшего визуального эффекта
    setTimeout(() => {
        if (draggedCard) {
            draggedCard.style.display = 'none';
        }
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();
    if (!draggedCard) return;

    const container = this.querySelector('.cards-container');
    if (!container) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    
    // Удаляем старый плейсхолдер
    const oldPlaceholder = container.querySelector('.card-placeholder');
    if (oldPlaceholder && oldPlaceholder !== placeholder) {
        oldPlaceholder.remove();
    }
    
    if (afterElement) {
        container.insertBefore(placeholder, afterElement);
    } else {
        container.appendChild(placeholder);
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgba(0, 121, 191, 0.1)';
}

function handleDragLeave(e) {
    e.preventDefault();
    // Проверяем, что мы действительно покидаем колонку, а не переходим на дочерний элемент
    if (!this.contains(e.relatedTarget)) {
        this.style.backgroundColor = '';
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedCard || !placeholder) return;

    const container = this.querySelector('.cards-container');
    if (!container) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    
    // Показываем перетаскиваемую карточку
    draggedCard.style.display = 'block';
    
    if (afterElement) {
        container.insertBefore(draggedCard, afterElement);
    } else {
        container.appendChild(draggedCard);
    }
    
    // Убираем плейсхолдер
    if (placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
    }
    placeholder = null;
    
    // Сбрасываем стили
    this.style.backgroundColor = '';
    draggedCard.classList.remove('dragging');
    draggedCard = null;
}

function handleDragEnd() {
    // Убеждаемся, что карточка снова видна
    if (this.style) {
        this.style.display = 'block';
    }
    this.classList.remove('dragging');
    
    // Убираем плейсхолдер, если он остался
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
        placeholder = null;
    }
    
    // Сбрасываем стили всех колонок
    document.querySelectorAll('.column').forEach(column => {
        column.style.backgroundColor = '';
    });
    
    draggedCard = null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function initializeSampleCards() {
    const sampleData = {
        todo: ['Welcome to Trello!', 'This is a card', 'Click on a card to see what\'s behind it'],
        progress: ['Invite your team', 'Drag people onto cards', 'Use color-coded labels'],
        done: ['To learn more tricks, check out the guide', 'Use as many boards as you want']
    };

    Object.keys(sampleData).forEach(columnId => {
        const container = document.querySelector(`[data-column-id="${columnId}"] .cards-container`);
        if (container) {
            sampleData[columnId].forEach(text => {
                createCard(text, container);
            });
        }
    });
}