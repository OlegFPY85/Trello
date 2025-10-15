import '../css/style.css';
import { Board } from './Board.js';

document.addEventListener('DOMContentLoaded', () => {
  window.trelloBoard = new Board();
});