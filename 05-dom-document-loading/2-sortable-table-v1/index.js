export default class SortableTable {
  element;
  sortedField = null;
  sortedOrder = null;
  orderDirection = {asc: 1, desc: -1}
  sortMethods = {
    string: (arr, order, category) => [...arr].sort((a, b) => order * a[category].localeCompare(b[category], { caseFirst: 'upper' })),
    number: (arr, order, category) => [...arr].sort((a, b) => order * (a[category] - b[category]))
  }

  constructor(header = [], {
    data = []
  } = {}) {
    this.headerData = header;
    this.elementsData = data;

    this.render();
  }

  getHeader = header => `
    <div data-element='header' class='sortable-table__header sortable-table__row'>
      ${header.map(item =>`
        <div
          class="sortable-table__cell"
          data-id=${item.id}
          data-sortable=${item.sortable}
          data-order=${item.id === this.sortedField ? this.sortedOrder : ''}>
            <span>${item.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
        </div>
      `).join('')}
    </div>
  `;

  getTable = (elements, header) => `
    ${elements.map(element => `
      <a href="/products/${element.id}" class="sortable-table__row">
      ${header.map(col => col.template ? col.template(element.images) : `
        <div class="sortable-table__cell">${element[col.id]}</div>
        `).join('')}
    </a>
    `).join('')}
  `;

  getSubs = element =>
    [...element.querySelectorAll('[data-element]')]
      .reduce((accum, current) => {
        accum[current.dataset.element] = current;
        return accum;
      }, {});


  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class='sortable-table'>
        ${this.getHeader(this.headerData)}
        <div data-element='body' class='sortable-table__body'>
          ${this.getTable(this.elementsData, this.headerData)}
        </div>
      </div>
    `;

    this.element = element.firstElementChild;
    this.subElements = this.getSubs(this.element);
  }

  sort(field, order) {
    this.sortedField = field;
    this.sortedOrder = order;
    const sortType = this.headerData.find(el => el.id === field)?.sortType;

    const sortMethod = this.sortMethods[sortType];
    const sortOrder = this.orderDirection[order];

    this.elementsData = sortMethod(this.elementsData, sortOrder, field);

    this.subElements.header.querySelectorAll('.sortable-table__cell')
      .forEach(element => {
        if (element.dataset.id === field) {
          element.dataset.order = order;
        }
      });

    this.subElements.body.innerHTML = this.getTable(this.elementsData, this.headerData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
