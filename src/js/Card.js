export class Card {
  constructor(text, board) {
    this.text = text;
    this.board = board;
    this.element = this.createElement();
    this.init();
  }

  createElement() {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.textContent = this.text;
    
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-card';
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Удалить карточку';
    
    card.append(deleteBtn);
    return card;
  }

  init() {
    this.element.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.element.addEventListener('dragend', this.handleDragEnd.bind(this));
    
    const deleteBtn = this.element.querySelector('.delete-card');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.element.remove();
    });
  }

  handleDragStart(e) {
    if (this.board) {
      this.board.handleDragStart(this, e);
    }
    
    const dragImage = this.createDragImage(e);
    e.dataTransfer.setDragImage(dragImage, this.board.dragOffset.x, this.board.dragOffset.y);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      if (dragImage.parentNode) {
        dragImage.remove();
      }
    }, 0);
  }

  createDragImage(e) {
    const dragImage = this.element.cloneNode(true);
    dragImage.style.width = `${this.element.offsetWidth}px`;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
    dragImage.style.position = 'fixed';
    dragImage.style.left = '-1000px';
    dragImage.style.top = '-1000px';
    dragImage.classList.add('dragging');
    
    document.body.append(dragImage);
    return dragImage;
  }

  handleDragEnd() {
    if (this.board) {
      this.board.handleDragEnd(this);
    }
  }
}