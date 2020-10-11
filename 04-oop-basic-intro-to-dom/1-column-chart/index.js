export default class ColumnChart {
  element;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  getLinkHtml = link => link
    ? `<a class="column-chart__link" href="${link}">View all</a>`
    : '';

  getDataHtml = data => {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item =>
      `<div
        style="--value: ${String(Math.floor(item * scale))}"
        data-tooltip="${(item / maxValue * 100).toFixed(0)}%"
      ></div>`
    ).join('');
  }

  render() {
    const element = document.createElement('div');
    element.className = `column-chart ${this.data.length > 0 ? '' : 'column-chart_loading'}`;
    element.style = `--chart-height: ${this.chartHeight};`;
    element.innerHTML = `
      <div class='column-chart__title'>
        Total ${this.label}
        ${this.getLinkHtml(this.link)}
      </div>
      <div class="column-chart__container">
        <div class="column-chart__header">${this.value}</div>
        <div class="column-chart__chart">
          ${this.getDataHtml(this.data)}
        </div>
      </div>
    `;
    this.element = element;
  }

  update(data) {
    this.data = data;
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
