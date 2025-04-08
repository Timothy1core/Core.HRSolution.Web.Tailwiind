import {
  getAttributeValueByBreakpoint,
  stringSnakeToCamel,
  getObjectPropertyValueByKey,
  EventHandlerUtil,
  throttle,
} from '../_utils/index';

class SwapperStore {
  static store = new Map();

  static set(instanceId, drawerComponentObj) {
    if (SwapperStore.has(instanceId)) {
      return;
    }

    SwapperStore.store.set(instanceId, drawerComponentObj);
  }

  static get(instanceId) {
    if (!SwapperStore.has(instanceId)) {
      return;
    }
    return SwapperStore.store.get(instanceId);
  }

  static remove(instanceId) {
    if (!SwapperStore.has(instanceId)) {
      return;
    }

    SwapperStore.store.delete(instanceId);
  }

  static has(instanceId) {
    return SwapperStore.store.has(instanceId);
  }

  static getAllInstances() {
    return SwapperStore.store;
  }
}

const defaultSwapperOptions = {
  mode: 'append',
};

const defaultSwapperQueries = {
  componentName: 'swapper',
  instanceQuery: '[data-kt-swapper="true"]',
  attrQuery: 'data-kt-swapper-',
};

class SwapperComponent {
  constructor(_element, _options = {}, _queries = defaultSwapperQueries) {
    this.element = _element;
    this.options = Object.assign({}, defaultSwapperOptions, _options);
    this.queries = _queries;

    // Initial update
    this.update();

    SwapperStore.set(this.element.id, this);
  }

  getOption(name) {
    const attr = this.element.getAttribute(`${this.queries.attrQuery}${name}`);
    if (attr) {
      const value = getAttributeValueByBreakpoint(attr);
      if (attr !== null && String(value) === 'true') {
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

  ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  update() {
    const parentSelector = this.getOption('parent')?.toString();
    const mode = this.getOption('mode');
    const parentElement = parentSelector ? document.querySelector(parentSelector) : null;
    if (parentElement && this.element.parentNode !== parentElement) {
      const alreadyPended = parentElement.querySelector(`#${this.element.id}`) !== null;
      if (!alreadyPended) {
        if (mode === 'prepend') {
          parentElement.prepend(this.element);
        } else if (mode === 'append') {
          parentElement.append(this.element);
        }
      }
    }
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
  static getInstance(el, componentName = defaultSwapperQueries.componentName) {
    const place = SwapperStore.get(el.id);
    if (place) {
      return place;
    }

    return null;
  }

  static createInstances(selector = defaultSwapperQueries.instanceQuery, options = defaultSwapperOptions, queries = defaultSwapperQueries) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((el) => {
      const item = el;
      let place = SwapperComponent.getInstance(item);
      if (!place) {
        place = new SwapperComponent(item, options, queries);
      }
    });
  }

  static createInstance(selector = defaultSwapperQueries.instanceQuery, options = defaultSwapperOptions, queries = defaultSwapperQueries) {
    const element = document.body.querySelector(selector);
    if (!element) {
      return;
    }
    const item = element;
    let place = SwapperComponent.getInstance(item);
    if (!place) {
      place = new SwapperComponent(item, options, queries);
    }
    return place;
  }

  static bootstrap(selector = defaultSwapperQueries.instanceQuery) {
    SwapperComponent.createInstances(selector);
  }

  static reinitialization(selector = defaultSwapperQueries.instanceQuery) {
    SwapperComponent.createInstances(selector);
  }
}

// Window resize handler
window.addEventListener('resize', function () {
  let timer;
  throttle(
    () => {
      // Locate and update Swapper instances on window resize
      const elements = document.querySelectorAll(defaultSwapperQueries.instanceQuery);
      elements.forEach((el) => {
        const place = SwapperComponent.getInstance(el);
        if (place) {
          place.update();
        }
      });
    },
    200,
    timer
  );
});

export { SwapperComponent, defaultSwapperOptions, defaultSwapperQueries };
