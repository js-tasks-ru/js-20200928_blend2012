class Tooltip {
  static instance;
  element;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
  }

  render(tooltip) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = tooltip;

    document.body.append(this.element);
  }

  initialize() {
    document.addEventListener('pointerover', this.handleOver);
    document.addEventListener('pointerout', this.handleOut);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.handleOver);
    document.removeEventListener('pointerout', this.handleOut);
    document.removeEventListener('pointermove', this.handleMove);

    this.remove();
  }


  handleOver = event => {
    const element = event.target.closest('[data-tooltip]');

    if (element) {
      this.render(element.dataset.tooltip);
      this.handleMove(event);

      document.addEventListener('pointermove', this.handleMove);
    }
  };

  handleMove = event => {
    this.element.style.left = `${event.clientX + 1}px`;
    this.element.style.top = `${event.clientY + 1}px`;
  }

  handleOut = () => {
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
