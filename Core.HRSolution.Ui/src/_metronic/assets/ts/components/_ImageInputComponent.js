import { EventHandlerUtil, DataUtil, getUniqueIdWithPrefix, getCSS } from '../_utils/index';

const defaultImageInputOptions = {};

const defaultImageInputQueries = {
  componentName: 'image-input',
  instanceQuery: '[data-kt-image-input]',
  inputQuery: 'input[type="file"]',
  wrapperQuery: '.image-input-wrapper',
  cancelQuery: '[data-kt-image-input-action="cancel"]',
  removeQuery: '[data-kt-image-input-action="remove"]',
  hiddenQuery: 'input[type="hidden"]',
};

class ImageInputComponent {
  constructor(_element, _options = defaultImageInputOptions, _queries = defaultImageInputQueries) {
    // Variables
    this.options = Object.assign(defaultImageInputOptions, _options);
    this.queries = _queries;
    this.uid = getUniqueIdWithPrefix(this.queries.componentName);

    // Elements
    this.element = _element;
    this.inputElement = this.element.querySelector(this.queries.inputQuery);
    this.wrapperElement = this.element.querySelector(this.queries.wrapperQuery);
    this.cancelElement = this.element.querySelector(this.queries.cancelQuery);
    this.removeElement = this.element.querySelector(this.queries.removeQuery);
    this.hiddenElement = this.element.querySelector(this.queries.hiddenQuery);
    if (this.wrapperElement) {
      this.src = getCSS(this.wrapperElement, 'backgroundImage');
    }

    // Event Handlers
    this.handlers();

    DataUtil.set(this.element, this.queries.componentName, this);
  }

  handlers() {
    this.element.addEventListener('change', this._change.bind(this));
    if (this.cancelElement) {
      this.cancelElement.addEventListener('click', this._cancel.bind(this));
    }

    if (this.removeElement) {
      this.removeElement.addEventListener('click', this._remove.bind(this));
    }
  }

  _change(e) {
    e.preventDefault();

    if (this.inputElement && this.inputElement.files && this.inputElement.files[0]) {
      // Fire change event
      if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.change', e) === false) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (this.wrapperElement && e.target) {
          this.wrapperElement.style.setProperty('background-image', `url('${e.target.result}')`);
        }
      };

      reader.readAsDataURL(this.inputElement.files[0]);
      this.element.classList.add('image-input-changed');
      this.element.classList.remove('image-input-empty');

      // Fire changed event
      EventHandlerUtil.trigger(this.element, 'kt.imageinput.changed', e);
    }
  }

  _cancel(e) {
    e.preventDefault();

    // Fire cancel event
    if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.cancel', e) === false) {
      return;
    }

    this.element.classList.remove('image-input-changed');
    this.element.classList.remove('image-input-empty');
    this.element.style.setProperty('background-image', this.src);
    if (this.inputElement) {
      this.inputElement.value = '';
    }

    if (this.hiddenElement) {
      this.hiddenElement.value = '0';
    }

    // Fire canceled event
    EventHandlerUtil.trigger(this.element, 'kt.imageinput.canceled', e);
  }

  _remove(e) {
    e.preventDefault();

    // Fire remove event
    if (EventHandlerUtil.trigger(this.element, 'kt.imageinput.remove', e) === false) {
      return;
    }

    this.element.classList.remove('image-input-changed');
    this.element.classList.add('image-input-empty');
    if (this.wrapperElement) {
      this.wrapperElement.style.setProperty('background-image', 'none');
    }

    if (this.inputElement) {
      this.inputElement.value = '';
    }

    if (this.hiddenElement) {
      this.hiddenElement.value = '1';
    }

    // Fire removed event
    EventHandlerUtil.trigger(this.element, 'kt.imageinput.removed', e);
  }

  // Public API
  getInputElement() {
    return this.inputElement;
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

  trigger(name, event) {
    return EventHandlerUtil.trigger(this.element, name, event);
  }

  // Static methods
  static getInstance(el, componentName = defaultImageInputQueries.componentName) {
    const imageInput = DataUtil.get(el, componentName);
    if (imageInput) {
      return imageInput;
    }
  }

  static createInstances(selector = defaultImageInputQueries.instanceQuery, options = defaultImageInputOptions, queries = defaultImageInputQueries) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
      const item = el;
      let imageInput = ImageInputComponent.getInstance(item);
      if (!imageInput) {
        imageInput = new ImageInputComponent(item, options, queries);
      }
    });
  }

  static createInstance(selector = defaultImageInputQueries.instanceQuery, options = defaultImageInputOptions, queries = defaultImageInputQueries) {
    const element = document.body.querySelector(selector);
    if (!element) {
      return;
    }
    const item = element;
    let imageInput = ImageInputComponent.getInstance(item);
    if (!imageInput) {
      imageInput = new ImageInputComponent(item, options, queries);
    }
    return imageInput;
  }

  static bootstrap(selector = defaultImageInputQueries.instanceQuery) {
    ImageInputComponent.createInstances(selector);
  }

  static reinitialization(selector = defaultImageInputQueries.instanceQuery) {
    ImageInputComponent.createInstances(selector);
  }
}

export { ImageInputComponent, defaultImageInputOptions, defaultImageInputQueries };
