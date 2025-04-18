/* eslint-disable no-useless-escape */
import { DataUtil } from '../_utils/index';

const defaultPasswordMeterOptions = {
  minLength: 8,
  checkUppercase: true,
  checkLowercase: true,
  checkDigit: true,
  checkChar: true,
  scoreHighlightClass: 'active',
};

const defaultPasswordMeterQueries = {
  componentName: 'password-meter',
  instanceQuery: '[data-kt-password-meter]',
  inputQuery: 'input[type]',
  visibilityQuery: '[data-kt-password-meter-control="visibility"]',
  highlightQuery: '[data-kt-password-meter-control="highlight"]',
};

class PasswordMeterComponent {
  constructor(_element, _options = defaultPasswordMeterOptions, _queries = defaultPasswordMeterQueries) {
    // Variables
    this.element = _element;
    this.options = Object.assign(defaultPasswordMeterOptions, _options);
    this.queries = _queries;
    this.score = 0;
    this.checkSteps = 5;

    // Elements
    this.inputElement = this.element.querySelector(this.queries.inputQuery);
    this.visibilityElement = this.element.querySelector(this.queries.visibilityQuery);
    this.highlightElement = this.element.querySelector(this.queries.highlightQuery);

    // Event Handlers
    this.handlers();

    DataUtil.set(this.element, this.queries.componentName, this);
  }

  handlers() {
    if (this.inputElement) {
      this.inputElement.addEventListener('input', () => {
        this.check();
      });
    }

    if (this.visibilityElement) {
      this.visibilityElement.addEventListener('click', () => {
        this.toggleVisibility();
      });
    }
  }

  toggleVisibility() {
    if (this.visibilityElement && this.inputElement) {
      const visibleIcon = this.visibilityElement.querySelector('i:not(.d-none), .:not(.d-none)');
      const hiddenIcon = this.visibilityElement.querySelector('i.d-none, ..d-none');
      const typeAttr = this.inputElement.getAttribute('type') || '';

      if (typeAttr === 'password') {
        this.inputElement.setAttribute('type', 'text');
      } else {
        this.inputElement.setAttribute('type', 'password');
      }

      if (visibleIcon) visibleIcon.classList.add('d-none');
      if (hiddenIcon) hiddenIcon.classList.remove('d-none');

      this.inputElement.focus();
    }
  }

  checkScore() {
    return 0;
  }

  checkLength() {
    if (this.inputElement) {
      return this.inputElement.value.length >= this.options.minLength; // 20 score
    }
    return false;
  }

  checkLowerCase() {
    const val = this.inputElement ? this.inputElement.value : '';
    return /[a-z]/.test(val); // 20 score
  }

  checkUppercase() {
    const val = this.inputElement ? this.inputElement.value : '';
    return /[A-Z]/.test(val); // 20 score
  }

  checkDigit() {
    const val = this.inputElement ? this.inputElement.value : '';
    return /[0-9]/.test(val); // 20 score
  }

  checkChar() {
    const val = this.inputElement ? this.inputElement.value : '';
    return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val); // 20 score
  }

  getCheckScore() {
    let count = 1;
    if (this.options.checkUppercase) count++;
    if (this.options.checkLowercase) count++;
    if (this.options.checkDigit) count++;
    if (this.options.checkChar) count++;

    this.checkSteps = count;
    return 100 / this.checkSteps;
  }

  highlight() {
    const items = this.highlightElement ? Array.from(this.highlightElement.querySelectorAll('div')) : [];
    const total = items.length;
    let index = 0;
    const checkScore = this.getCheckScore();
    const score = this.getScore();

    items.forEach((item) => {
      index++;
      if (checkScore * index * (this.checkSteps / total) <= score) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Public API
  reset() {
    this.score = 0;
    this.highlight();
  }

  getScore() {
    return this.score;
  }

  check() {
    let score = 0;
    const checkScore = this.getCheckScore();
    if (this.checkLength()) score += checkScore;
    if (this.options.checkUppercase && this.checkLowerCase()) score += checkScore;
    if (this.options.checkLowercase && this.checkUppercase()) score += checkScore;
    if (this.options.checkDigit && this.checkDigit()) score += checkScore;
    if (this.options.checkChar && this.checkChar()) score += checkScore;

    this.score = score;
    this.highlight();
  }

  // Static methods
  static getInstance(el, componentName = defaultPasswordMeterQueries.componentName) {
    const passwordMeter = DataUtil.get(el, componentName);
    if (passwordMeter) {
      return passwordMeter;
    }
  }

  static createInstances(selector = defaultPasswordMeterQueries.instanceQuery, options = defaultPasswordMeterOptions, queries = defaultPasswordMeterQueries) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
      const item = el;
      let passwordMeter = PasswordMeterComponent.getInstance(item);
      if (!passwordMeter) {
        passwordMeter = new PasswordMeterComponent(item, options, queries);
      }
    });
  }

  static createInstance(selector = defaultPasswordMeterQueries.instanceQuery, options = defaultPasswordMeterOptions, queries = defaultPasswordMeterQueries) {
    const element = document.body.querySelector(selector);
    if (!element) {
      return;
    }
    const item = element;
    let passwordMeter = PasswordMeterComponent.getInstance(item);
    if (!passwordMeter) {
      passwordMeter = new PasswordMeterComponent(item, options, queries);
    }
    return passwordMeter;
  }

  static bootstrap(selector = defaultPasswordMeterQueries.instanceQuery) {
    PasswordMeterComponent.createInstances(selector);
  }

  static reinitialization(selector = defaultPasswordMeterQueries.instanceQuery) {
    PasswordMeterComponent.createInstances(selector);
  }
}

export { PasswordMeterComponent, defaultPasswordMeterOptions, defaultPasswordMeterQueries };
