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
    
    card.appendChild(deleteBtn);
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

    const dragImage = this.element.cloneNode(true);
    dragImage.style.width = `${this.element.offsetWidth}px`;
    dragImage.style.opacity = '0.7';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }

  handleDragEnd() {
    if (this.board) {
      this.board.handleDragEnd(this);
    }
  }
}