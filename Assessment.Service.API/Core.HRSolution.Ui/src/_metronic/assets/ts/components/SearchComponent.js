import {
  EventHandlerUtil,
  DataUtil,
  getBreakpoint,
  getAttributeValueByBreakpoint,
  stringSnakeToCamel,
  getObjectPropertyValueByKey,
  getViewPort,
  isVisibleElement,
  throttle,
} from '../_utils/index';

import { MenuComponent, defaultMenuOptions } from './MenuComponent';

// Default options and queries
const defaultSearchOptions = {
  minLength: 2, // Minimum text length to query search
  keypress: true, // Enable search on keypress
  enter: true, // Enable search on enter key press
  layout: 'menu', // Use 'menu' or 'inline' layout options to display search results
  showOnFocus: true, // Always show menu on input focus
};

const defaultSearchQueries = {
  componentName: 'search',
  instanceQuery: '[data-kt-search]',
  attrQuery: 'data-kt-search-',
};

class SearchComponent {
  constructor(_element, _options = {}, _queries = {}) {
    // Variables
    this.options = Object.assign({}, defaultSearchOptions, _options);
    this.queries = Object.assign({}, defaultSearchQueries, _queries);

    // Elements
    this.element = _element;
    this.contentElement = this._getElement('content');
    this.formElement = this._getElement('form');
    this.inputElement = this._getElement('input');
    this.spinnerElement = this._getElement('spinner');
    this.clearElement = this._getElement('clear');
    this.toggleElement = this._getElement('toggle');
    this.submitElement = this._getElement('submit');
    this.toolbarElement = this._getElement('toolbar');
    this.resultsElement = this._getElement('results');
    this.suggestionElement = this._getElement('suggestion');
    this.emptyElement = this._getElement('empty');

    // Layout
    this.layout = this.getOption('layout');
    if (this.layout === 'menu') {
      this.menuObject = new MenuComponent(this.contentElement, defaultMenuOptions);
    }

    // Update
    this.update();

    // Event Handlers
    this.handlers();

    DataUtil.set(this.element, this.queries.componentName, this);
  }

  _getElement(name) {
    return this.element.querySelector(`[data-kt-search-element="${name}"]`);
  }

  // Get option
  getOption(name) {
    const attr = this.element.getAttribute(`${this.queries.attrQuery}${name}`);
    if (attr) {
      const value = getAttributeValueByBreakpoint(attr);

      if (value !== null && String(value) === 'true') {
        return true;
      } else if (value !== null && String(value) === 'false') {
        return false;
      }

      return value;
    } else {
      const optionName = stringSnakeToCamel(name);

      const option = getObjectPropertyValueByKey(this.options, optionName);
      if (option) {
        return getAttributeValueByBreakpoint(option);
      } else {
        return null;
      }
    }
  }

  // Check if responsive form mode is enabled
  getResponsiveFormMode() {
    const responsive = this.getOption('responsive');
    const width = getViewPort().width;

    if (!responsive) {
      return null;
    }

    const breakpoint = getBreakpoint(responsive);
    let breakPointNum = -1;
    if (!breakpoint) {
      breakPointNum = parseInt(responsive, 10);
    } else {
      breakPointNum = +breakpoint;
    }

    return width < breakPointNum ? 'on' : 'off';
  }

  // Focus
  focus = () => {
    this.element.classList.add('focus');

    if (
      this.getOption('show-on-focus') === true ||
      this.inputElement.value.length >= this.options.minLength
    ) {
      this.show();
    }
  }

  // Blur
  blur = () => {
    this.element.classList.remove('focus');
  }

  // Enter
  enter = (e) => {
    const key = e.charCode || e.keyCode || 0;

    if (key === 13) {
      e.preventDefault();

      this.search();
    }
  }

  // Input
  input = () => {
    if (this.getOption('min-length')) {
      const minLength = parseInt(this.getOption('min-length'), 10);

      if (this.inputElement.value.length >= minLength) {
        this.search();
      } else if (this.inputElement.value.length === 0) {
        this.clear();
      }
    }
  }

  handlers() {
    const context = this;

    // Focus
    this.inputElement.addEventListener('focus', this.focus);

    // Blur
    this.inputElement.addEventListener('blur', this.blur);

    // Keypress
    if (this.getOption('keypress') === true) {
      this.inputElement.addEventListener('input', this.input);
    }

    // Submit
    if (this.submitElement) {
      this.submitElement.addEventListener('click', this.search);
    }

    // Enter
    if (this.getOption('enter') === true) {
      this.inputElement.addEventListener('keypress', this.enter);
    }

    // Clear
    if (this.clearElement) {
      this.clearElement.addEventListener('click', this.clear);
    }

    // Menu
    if (this.menuObject) {
      // Toggle menu
      if (this.toggleElement) {
        this.toggleElement.addEventListener('click', this.show);

        this.menuObject.on('kt.menu.dropdown.show', function () {
          if (isVisibleElement(context.toggleElement)) {
            context.toggleElement.classList.add('active');
            context.toggleElement.classList.add('show');
          }
        });

        this.menuObject.on('kt.menu.dropdown.hide', function () {
          if (isVisibleElement(context.toggleElement)) {
            context.toggleElement.classList.remove('active');
            context.toggleElement.classList.remove('show');
          }
        });
      }

      this.menuObject.on('kt.menu.dropdown.shown', function () {
        context.inputElement.focus();
      });
    }

    // Window resize handling
    window.addEventListener('resize', () => {
      let timer;

      throttle(
        timer,
        () => {
          this.update();
        },
        200
      );
    });
  }

  ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Update
  update = () => {
    // Handle responsive form
    if (this.layout === 'menu') {
      const responsiveFormMode = this.getResponsiveFormMode();

      if (responsiveFormMode === 'on' && !this.contentElement.contains(this.formElement)) {
        this.contentElement.prepend(this.formElement);
        this.formElement.classList.remove('d-none');
      } else if (responsiveFormMode === 'off' && this.contentElement.contains(this.formElement)) {
        this.element.prepend(this.formElement);
        this.formElement.classList.add('d-none');
      }
    }
  }

  // Show menu
  show = () => {
    if (this.menuObject) {
      this.update();
      this.menuObject.show(this.element);
    }
  }

  // Hide menu
  hide = () => {
    if (this.menuObject) {
      this.update();
      this.menuObject.hide(this.element);
    }
  }

  // Search
  search = () => {
    if (!this.processing) {
      // Show search spinner
      if (this.spinnerElement) {
        this.spinnerElement.classList.remove('d-none');
      }

      // Hide search clear button
      if (this.clearElement) {
        this.clearElement.classList.add('d-none');
      }

      // Hide search toolbar
      if (this.toolbarElement) {
        this.toolbarElement.classList.add('d-none');
      }

      // Focus input
      this.inputElement.focus();

      this.processing = true;
      EventHandlerUtil.trigger(this.element, 'kt.search.process', this);
    }
  }

  // Complete
  complete = () => {
    if (this.spinnerElement) {
      this.spinnerElement.classList.add('d-none');
    }

    // Show search toolbar
    if (this.clearElement) {
      this.clearElement.classList.remove('d-none');
    }

    if (this.inputElement.value.length === 0) {
      this.clear();
    }

    // Focus input
    this.inputElement.focus();

    this.show();

    this.processing = false;
  }

  // Clear
  clear = () => {
    if (EventHandlerUtil.trigger(this.element, 'kt.search.clear') === false) {
      return;
    }

    // Clear and focus input
    this.inputElement.value = '';
    this.inputElement.focus();

    // Hide clear icon
    if (this.clearElement) {
      this.clearElement.classList.add('d-none');
    }

    // Show search toolbar
    if (this.toolbarElement) {
      this.toolbarElement.classList.remove('d-none');
    }

    // Hide menu
    if (this.getOption('show-on-focus') === false) {
      this.hide();
    }

    EventHandlerUtil.trigger(this.element, 'kt.search.cleared');
  }

  isProcessing = () => {
    return this.processing;
  }

  getQuery = () => {
    return this.inputElement.value;
  }

  getMenu = () => {
    return this.menuObject;
  }

  getFormElement = () => {
    return this.formElement;
  }

  getInputElement() {
    return this.inputElement;
  }

  getContentElement() {
    return this.contentElement;
  }

  getElement() {
    return this.element;
  }

  // Event API
  on(name, handler) {
    return EventHandlerUtil.on(this.element, name, handler);
  }

  one(name, handler) {
    return EventHandlerUtil.one(this.element, name, handler);
  }

  off(name, handlerId) {
    return EventHandlerUtil.off(this.element, name, handlerId);
  }

  // Static methods
  static getInstance(el, componentName = defaultSearchQueries.componentName) {
    const search = DataUtil.get(el, componentName);
    if (search) {
      return search;
    }
    return null;
  }

  static createInstances(selector = defaultSearchQueries.instanceQuery, options = defaultSearchOptions, queries = defaultSearchQueries) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
      const item = el;
      let search = SearchComponent.getInstance(item);
      if (!search) {
        search = new SearchComponent(item, options, queries);
      }
    });
  }

  static createInstance(selector = defaultSearchQueries.instanceQuery, options = defaultSearchOptions, queries = defaultSearchQueries) {
    const element = document.body.querySelector(selector);
    if (!element) {
      return;
    }
    const item = element;
    let search = SearchComponent.getInstance(item);
    if (!search) {
      search = new SearchComponent(item, options, queries);
    }
    return search;
  }

  static bootstrap(selector = defaultSearchQueries.instanceQuery) {
    SearchComponent.createInstances(selector);
  }

  static reinitialization(selector = defaultSearchQueries.instanceQuery) {
    SearchComponent.createInstances(selector);
  }
}

export { SearchComponent, defaultSearchOptions, defaultSearchQueries };
