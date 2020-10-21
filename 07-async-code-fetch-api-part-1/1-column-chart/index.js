import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const domain = 'https://course-js.javascript.ru';

const getPath = (url, from, to) => escapeHtml(`${domain}/${url}?from=${from}&to=${to}`);

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  data = [];

  constructor({
    url = '',
    label = '',
    link = '',
    formatHeading = x => x,
    range = {
      from: new Date(),
      to: new Date(),
    }
  } = {}) {
    this.url = url;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    const { from, to } = range;

    this.url = new URL(url, domain);

    this.render();
    this.getData(from, to);
  }

  getHeaderVal = data => this.formatHeading(Object.values(data).reduce((accum, item) => (accum + item), 0));

  async getData(from, to) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
    const fetchedData = await fetchJson(this.url);

    this.data = Object.values(fetchedData);

    this.subElements.header.textContent = this.getHeaderVal(this.data);
    this.subElements.body.innerHTML = this.getColumnBody(this.data);
    this.element.classList.remove('column-chart_loading');
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);

    return data
      .map(item => {
        const scale = this.chartHeight / maxValue;
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>
          <div data-element="body" class="column-chart__chart">
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(from, to) {
    await this.getData(from, to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
