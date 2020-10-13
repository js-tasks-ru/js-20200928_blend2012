export default class NotificationMessage {
  element;
  timer = null;
  static currInstance;

  constructor(name, {
    duration = 1000,
    type = 'success',
  } = {}) {
    this.name = name;
    this.duration = duration;
    this.type = type;

    if (NotificationMessage.currInstance) {
      NotificationMessage.currInstance.remove();
    }

    this.render();
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class='notification ${this.type}' style='--value: ${Math.floor(this.duration / 1000)}s;'>
        <div class='timer'></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.name}
          </div>
        </div>
      </div>
    `;

    this.element = NotificationMessage.currInstance = element.firstElementChild;
  }

  show(targetElement = document.body) {
    targetElement.append(this.element);
    this.timer = setTimeout(this.remove.bind(this), this.duration);
  }

  remove() {
    this.element.remove();
    clearTimeout(this.timer);
  }

  destroy() {
    this.remove();
  }
}
