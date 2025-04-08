import {
  DataUtil,
  getObjectPropertyValueByKey,
  stringSnakeToCamel,
  getAttributeValueByBreakpoint,
  getViewPort,
  isVisibleElement,
  throttle,
  getCSS,
  ElementStyleUtil,
} from '../_utils/index';
import { CookieComponent } from './_CookieComponent';

const defaultScrollOptions = {
  saveState: true,
};

class ScrollComponent {
  constructor(_element, options = defaultScrollOptions) {
    // Variables
    this.element = _element;
    this.options = Object.assign(defaultScrollOptions, options);
    this.id = this.element.getAttribute('id') || '';
    this.update();
    DataUtil.set(this.element, 'scroll', this);
  }

  getOption(name) {
    if (this.element.hasAttribute('data-kt-scroll-' + name)) {
      const attr = this.element.getAttribute('data-kt-scroll-' + name) || '';
      let value = getAttributeValueByBreakpoint(attr);
      if (value !== null && String(value) === 'true') {
        value = true;
      } else if (value !== null && String(value) === 'false') {
        value = false;
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

  getHeightType() {
    if (this.getOption('height')) {
      return 'height';
    }
    if (this.getOption('min-height')) {
      return 'min-height';
    }
    if (this.getOption('max-height')) {
      return 'max-height';
    }
  }

  getAutoHeight() {
    let height = getViewPort().height;
    const dependencies = this.getOption('dependencies');
    const wrappers = this.getOption('wrappers');
    const offset = this.getOption('offset');

    // Height dependencies
    if (dependencies !== null) {
      const elements = document.querySelectorAll(dependencies);
      if (elements && elements.length > 0) {
        elements.forEach((element) => {
          if (!isVisibleElement(element)) {
            return;
          }
          height -= parseInt(getCSS(element, 'height'), 10);
          height -= parseInt(getCSS(element, 'margin-top'), 10);
          height -= parseInt(getCSS(element, 'margin-bottom'), 10);

          const borderTop = getCSS(element, 'border-top');
          if (borderTop) {
            height -= parseInt(borderTop, 10);
          }

          const borderBottom = getCSS(element, 'border-bottom');
          if (borderBottom) {
            height -= parseInt(borderBottom, 10);
          }
        });
      }
    }

    // Wrappers
    if (wrappers !== null) {
      const elements = document.querySelectorAll(wrappers);
      if (elements && elements.length > 0) {
        elements.forEach((element) => {
          if (!isVisibleElement(element)) {
            return;
          }
          height -= parseInt(getCSS(element, 'margin-top'), 10);
          height -= parseInt(getCSS(element, 'margin-bottom'), 10);
          height -= parseInt(getCSS(element, 'padding-top'), 10);
          height -= parseInt(getCSS(element, 'padding-bottom'), 10);

          const borderTop = getCSS(element, 'border-top');
          if (borderTop) {
            height -= parseInt(borderTop, 10);
          }

          const borderBottom = getCSS(element, 'border-bottom');
          if (borderBottom) {
            height -= parseInt(borderBottom, 10);
          }
        });
      }
    }

    // Custom offset
    if (offset !== null) {
      height -= parseInt(offset, 10);
    }

    height -= parseInt(getCSS(this.element, 'margin-top'), 10);
    height -= parseInt(getCSS(this.element, 'margin-bottom'), 10);

    const borderTop = getCSS(this.element, 'border-top');
    if (borderTop) {
      height -= parseInt(borderTop, 10);
    }

    const borderBottom = getCSS(this.element, 'border-bottom');
    if (borderBottom) {
      height -= parseInt(borderBottom, 10);
    }

    height = height + 'px';
    return height;
  }

  setupHeight() {
    const height = this.getHeight();
    const heightType = this.getHeightType();
    if (height !== null && height.length > 0) {
      ElementStyleUtil.set(this.element, heightType, height);
    } else {
      ElementStyleUtil.set(this.element, heightType, '');
    }
  }

  setupState() {
    if (this.getOption('save-state') === true && this.id) {
      const cookie = CookieComponent.get(this.id + 'st');
      if (cookie) {
        const pos = parseInt(cookie, 10);
        if (pos > 0) {
          this.element.scrollTop = pos;
        }
      }
    }
  }

  setupScrollHandler() {
    if (this.getOption('save-state') === true && this.id) {
      this.element.addEventListener('scroll', this.scrollHandler.bind(this));
    } else {
      this.element.removeEventListener('scroll', this.scrollHandler.bind(this));
    }
  }

  scrollHandler() {
    const cookieId = this.id + 'st';
    CookieComponent.set(cookieId, this.element.scrollTop, {});
  }

  destroyScrollHandler() {
    this.element.removeEventListener('scroll', this.scrollHandler.bind(this));
  }

  resetHeight() {
    const heightType = this.getHeightType();
    if (heightType) {
      ElementStyleUtil.set(this.element, heightType, '');
    }
  }

  // Public API
  update() {
    // Activate/deactivate
    if (
      this.getOption('activate') === true ||
      !this.element.hasAttribute('data-kt-scroll-activate')
    ) {
      this.setupHeight();
      this.setupScrollHandler();
      this.setupState();
    } else {
      this.resetHeight();
      this.destroyScrollHandler();
    }
  }

  getHeight() {
    const heightType = this.getHeightType();
    const height = this.getOption(heightType || '');
    if (typeof height === 'function') {
      return height.call(height);
    } else if (height !== null && typeof height === 'string' && height.toLowerCase() === 'auto') {
      return this.getAutoHeight();
    } else {
      return height;
    }
  }

  getElement() {
    return this.element;
  }

  // Static methods
  static hasInstance(element) {
    return DataUtil.has(element, 'scroll');
  }

  static getInstance(element) {
    if (element !== null && ScrollComponent.hasInstance(element)) {
      const data = DataUtil.get(element, 'scroll');
      if (data) {
        return data;
      }
    }
  }

  // Create Instances
  static createInstances(selector) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((element) => {
      const item = element;
      let scroll = ScrollComponent.getInstance(item);
      if (!scroll) {
        scroll = new ScrollComponent(item, defaultScrollOptions);
      }
    });
  }

  static destroyAll(attr = '[data-kt-scroll="true"]') {
    // Implementation for destroying all instances
  }

  static bootstrap(attr = '[data-kt-scroll="true"]') {
    ScrollComponent.createInstances(attr);
    ScrollComponent.resize();
  }

  static createInstance(element, options = defaultScrollOptions) {
    let scroll = ScrollComponent.getInstance(element);
    if (!scroll) {
      scroll = new ScrollComponent(element, options);
    }
    return scroll;
  }

  static reinitialization(attr = '[data-kt-scroll="true"]') {
    ScrollComponent.createInstances(attr);
  }

  static updateAll() {
    const elements = document.body.querySelectorAll('[data-kt-scroll="true"]');
    elements.forEach((element) => {
      const instance = ScrollComponent.getInstance(element);
      if (instance) {
        instance.update();
      }
    });
  }

  static resize() {
    // Window Resize Handling
    window.addEventListener('resize', function () {
      let timer;
      throttle(
        timer,
        () => {
          ScrollComponent.updateAll();
        },
        200
      );
    });
  }
}

export { ScrollComponent, defaultScrollOptions };
