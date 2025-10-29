import { Card } from './Card.js';

export class Board {
  constructor() {
    this.columns = document.querySelectorAll('.column');
    this.draggedCard = null;
    this.dragOffset = { x: 0, y: 0 };
    this.placeholder = null;
    this.init();
  }

  init() {
    this.initializeCardEvents();
    this.initializeColumnEvents();
    this.initializeAddCardForms();
    this.initializeSampleCards();
  }

  initializeColumnEvents() {
    this.columns.forEach(column => {
      column.addEventListener('dragover', this.handleDragOver.bind(this));
      column.addEventListener('drop', this.handleDrop.bind(this));
      column.addEventListener('dragenter', this.handleDragEnter.bind(this));
      column.addEventListener('dragleave', this.handleDragLeave.bind(this));
    });
  }

  initializeAddCardForms() {
    document.querySelectorAll('.add-card-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showAddCardForm(btn));
    });

    document.querySelectorAll('.cancel-add-card').forEach(btn => {
      btn.addEventListener('click', (e) => this.hideAddCardForm(e.target.closest('.column')));
    });

    document.querySelectorAll('.confirm-add-card').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleAddCard(e.target.closest('.column')));
    });

    document.querySelectorAll('.card-text').forEach(textarea => {
      textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleAddCard(e.target.closest('.column'));
        }
      });
    });
  }

  showAddCardForm(button) {
    const column = button.closest('.column');
    const form = column.querySelector('.add-card-form');
    const textarea = form.querySelector('.card-text');
    
    button.style.display = 'none';
    form.style.display = 'block';
    textarea.focus();
  }

  hideAddCardForm(column) {
    const form = column.querySelector('.add-card-form');
    const button = column.querySelector('.add-card-btn');
    const textarea = form.querySelector('.card-text');
    
    form.style.display = 'none';
    button.style.display = 'block';
    textarea.value = '';
  }

  handleAddCard(column) {
    const textarea = column.querySelector('.card-text');
    const text = textarea.value.trim();
    
    if (text) {
      const container = column.querySelector('.cards-container');
      this.createCard(text, container);
    }
    
    this.hideAddCardForm(column);
  }

  createCard(text, container) {
    const card = new Card(text, this);
    container.append(card.element);
    return card;
  }

  handleDragStart(card, e) {
    this.draggedCard = card;
    
    const rect = card.element.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
    
    card.element.classList.add('dragging');
    
    this.placeholder = document.createElement('div');
    this.placeholder.className = 'card-placeholder';
    this.placeholder.style.height = `${card.element.offsetHeight}px`;
  }

  handleDragOver(e) {
    e.preventDefault();
    if (!this.draggedCard) return;

    const container = this.findCardsContainer(e.target);
    if (!container) return;

    const afterElement = this.getDragAfterElement(container, e.clientY);
    
    const existingPlaceholder = container.querySelector('.card-placeholder');
    if (existingPlaceholder) {
      existingPlaceholder.remove();
    }
    
    if (afterElement) {
      container.insertBefore(this.placeholder, afterElement);
    } else {
      container.append(this.placeholder);
    }
  }

  handleDragEnter(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (column) {
      column.classList.add('drag-over');
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    const column = e.target.closest('.column');
    if (column && !column.contains(e.relatedTarget)) {
      column.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    if (!this.draggedCard || !this.placeholder) return;

    const container = this.findCardsContainer(e.target);
    if (!container) return;

    const cards = container.querySelectorAll('.card:not(.dragging)');
    const placeholderIndex = Array.from(container.children).indexOf(this.placeholder);
    
    if (placeholderIndex >= 0) {
      container.insertBefore(this.draggedCard.element, container.children[placeholderIndex]);
    } else {
      container.append(this.draggedCard.element);
    }
    
    this.cleanupDrag();
  }

  handleDragEnd(card) {
    this.cleanupDrag();
  }

  cleanupDrag() {
    if (this.draggedCard) {
      this.draggedCard.element.classList.remove('dragging');
      this.draggedCard = null;
    }
    
    if (this.placeholder) {
      this.placeholder.remove();
      this.placeholder = null;
    }
    
    this.columns.forEach(column => {
      column.classList.remove('drag-over');
    });
  }

  findCardsContainer(element) {
    return element.closest('.column')?.querySelector('.cards-container');
  }

  getDragAfterElement(container, y) {
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

  initializeCardEvents() {
    // Events are handled by Card class
  }

  initializeSampleCards() {
    const sampleData = {
      todo: [
        "Добро пожаловать в Trello!",
        "Это открытка",
        "Нажмите на открытку, чтобы увидеть, что за ней скрывается",
        "Вы можете прикреплять фотографии и файлы...",
        "... любые гиперссылки...",
        "...или контрольные списки."
      ],
      progress: [
        "Пригласите свою команду на эту доску, нажав кнопку 'Добавить участников'",
        "Перетащите людей на карточку, чтобы указать, что они отвечают за это",
        "Используйте цветные надписи для организации",
        "Составьте столько списков, сколько вам нужно!",
        "Попробуйте перетаскивать карточки куда угодно.",
        "Закончили с открыткой? Заархивируйте это."
      ],
      done: [
        "Чтобы узнать больше трюков, ознакомьтесь с руководством",
        "Используйте столько досок, сколько хотите. Мы сделаем еще больше!",
        "Хотите использовать сочетания клавиш? Они у нас есть!",
        "Хотите обновления о новых функциях?",
        "Нужна помощь?",
        "Хотите актуальные советы, примеры использования или информацию об API?"
      ]
    };

    Object.keys(sampleData).forEach(columnId => {
      const container = document.querySelector(`[data-column-id="${columnId}"] .cards-container`);
      if (container) {
        sampleData[columnId].forEach(text => {
          this.createCard(text, container);
        });
      }
    });
  }
}