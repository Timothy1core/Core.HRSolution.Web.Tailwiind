import {
  EventHandlerUtil,
  getUniqueIdWithPrefix,
  getObjectPropertyValueByKey,
  stringSnakeToCamel,
  getAttributeValueByBreakpoint,
  throttle,
  getCSS,
  DOMEventHandlerUtil,
  ElementStyleUtil,
} from '../_utils/index';

export class DrawerStore {
  static store = new Map();

  static set(instanceId, drawerComponentObj) {
    if (DrawerStore.has(instanceId)) {
      return;
    }
    DrawerStore.store.set(instanceId, drawerComponentObj);
  }

  static get(instanceId) {
    if (!DrawerStore.has(instanceId)) {
      return;
    }
    return DrawerStore.store.get(instanceId);
  }

  static remove(instanceId) {
    if (!DrawerStore.has(instanceId)) {
      return;
    }
    DrawerStore.store.delete(instanceId);
  }

  static has(instanceId) {
    return DrawerStore.store.has(instanceId);
  }

  static getAllInstances() {
    return DrawerStore.store;
  }
}

const defaultDrawerOptions = {
  overlay: true,
  baseClass: 'drawer',
  overlayClass: 'drawer-overlay',
  direction: 'end',
};

class DrawerComponent {
  constructor(_element, options) {
    this.element = _element;
    this.options = Object.assign(defaultDrawerOptions, options);
    this.instanceUid = getUniqueIdWithPrefix('drawer');
    this.overlayElement = null;
    this.name = this.element.getAttribute('data-kt-drawer-name') || '';
    this.shown = false;
    this.toggleElement = null;
    this.closeElement = null;
    this.lastWidth = 0;

    // Event Handlers
    this._handlers();
    // Update Instance
    this._update();
    // Bind Instance
    DrawerStore.set(this.element.id, this);
  }

  _handlers() {
    const togglers = this._getOption('toggle');
    const closers = this._getOption('close');

    if (togglers && togglers.length > 0) {
      DOMEventHandlerUtil.on(document.body, togglers, 'click', (e) => {
        e.preventDefault();
        this.toggleElement = document.getElementById(togglers);
        this._toggle();
      });
    }

    if (closers && closers.length > 0) {
      DOMEventHandlerUtil.on(document.body, closers, 'click', (e) => {
        e.preventDefault();
        this.closeElement = document.getElementById(closers);
        this._hide();
      });
    }
  }

  _update() {
    const width = String(this._getOption('width'));
    const direction = String(this._getOption('direction'));

    // Reset state
    const hasBaseClass = this.element.classList.contains(`${this.options.baseClass}-on`);
    const bodyCanvasAttr = String(document.body.getAttribute(`data-kt-drawer-${this.name}-`));

    this.shown = hasBaseClass && bodyCanvasAttr === 'on';

    // Activate/deactivate
    if (this._getOption('activate') === true) {
      this.element.classList.add(this.options.baseClass);
      this.element.classList.add(`${this.options.baseClass}-${direction}`);
      ElementStyleUtil.set(this.element, 'width', width, true);

      this.lastWidth = parseInt(width);
    } else {
      ElementStyleUtil.set(this.element, 'width', '');
      this.element.classList.remove(this.options.baseClass);
      this.element.classList.remove(`${this.options.baseClass}-${direction}`);
      this._hide();
    }
  }

  _getOption(name) {
    const attr = this.element.getAttribute(`data-kt-drawer-${name}`);
    if (attr) {
      const value = getAttributeValueByBreakpoint(attr);
      if (value !== null) {
        if (String(value) === 'true') return true;
        if (String(value) === 'false') return false;
        return value;
      }
    }
    const optionName = stringSnakeToCamel(name);
    const option = getObjectPropertyValueByKey(this.options, optionName);
    if (option) {
      return getAttributeValueByBreakpoint(option);
    }
    return null;
  }

  _toggle() {
    if (EventHandlerUtil.trigger(this.element, 'kt.drawer.toggle') === false) {
      return;
    }
    if (this.shown) {
      this._hide();
    } else {
      this._show();
    }
    EventHandlerUtil.trigger(this.element, 'kt.drawer.toggled');
  }

  _hide() {
    if (EventHandlerUtil.trigger(this.element, 'kt.drawer.hide') === false) {
      return;
    }
    this.shown = false;
    this._deleteOverlay();
    document.body.removeAttribute(`data-kt-drawer-${this.name}`);
    document.body.removeAttribute(`data-kt-drawer`);
    this.element.classList.remove(`${this.options.baseClass}-on`);
    if (this.toggleElement) {
      this.toggleElement.classList.remove('active');
    }
    EventHandlerUtil.trigger(this.element, 'kt.drawer.after.hidden');
  }

  _show() {
    if (EventHandlerUtil.trigger(this.element, 'kt.drawer.show') === false) {
      return;
    }
    this.shown = true;
    this._createOverlay();
    document.body.setAttribute(`data-kt-drawer-${this.name}`, 'on');
    document.body.setAttribute('data-kt-drawer', 'on');
    this.element.classList.add(`${this.options.baseClass}-on`);
    if (this.toggleElement) {
      this.toggleElement.classList.add('active');
    }
    EventHandlerUtil.trigger(this.element, 'kt.drawer.shown');
  }

  _createOverlay() {
    if (this._getOption('overlay') === true) {
      this.overlayElement = document.createElement('DIV');
      const elementZIndex = getCSS(this.element, 'z-index');
      if (elementZIndex) {
        const overlayZindex = parseInt(elementZIndex) - 1;
        ElementStyleUtil.set(this.overlayElement, 'z-index', overlayZindex);
      }
      document.body.append(this.overlayElement);
      const overlayClassOption = this._getOption('overlay-class');
      if (overlayClassOption) {
        this.overlayElement.classList.add(overlayClassOption.toString());
      }
      if (!this._getOption('permanent')) {
        this.overlayElement.addEventListener('click', (e) => {
          e.preventDefault();
          this._hide();
        });
      }
    }
  }

  _deleteOverlay() {
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
    }
  }

  _getDirection() {
    return String(this._getOption('direction')) === 'left' ? 'left' : 'right';
  }

  _getWidth() {
    let width = this._getOption('width');
    if (width && width === 'auto') {
      width = getCSS(this.element, 'width');
    }
    return width;
  }

  // Public API
  toggle() {
    this._toggle();
  }

  show() {
    this._show();
  }

  hide() {
    this._hide();
  }

  isShown() {
    return this.shown;
  }

  update() {
    this._update();
  }

  goElement() {
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
  static hasInstace(elementId) {
    return DrawerStore.has(elementId);
  }

  static getInstance(elementId) {
    return DrawerStore.get(elementId);
  }

  static hideAll() {
    const oldInstances = DrawerStore.getAllInstances();
    oldInstances.forEach((dr) => {
      dr.hide();
    });
  }

  static updateAll() {
    const oldInstances = DrawerStore.getAllInstances();
    oldInstances.forEach((dr) => {
      dr.update();
    });
  }

  // Create Instances
  static createInstances(selector) {
    const elements = document.body.querySelectorAll(selector);
    elements.forEach((element) => {
      const item = element;
      let drawer = DrawerComponent.getInstance(item.id);
      if (!drawer) {
        drawer = new DrawerComponent(item, defaultDrawerOptions);
      }
      drawer.element = item;
      drawer.hide();
    });
  }

  // Dismiss instances
  static handleDismiss() {
    // External drawer toggle handler
    DOMEventHandlerUtil.on(document.body, '[data-kt-drawer-dismiss="true"]', 'click', function() {
      const element = this.closest('[data-kt-drawer="true"]');
      if (element) {
        const drawer = DrawerComponent.getInstance(element.id);
        if (drawer && drawer.isShown()) {
          drawer.hide();
        }
      }
    });
  }

  // Global Initialization
  static initGlobalHandlers() {
    // Window Resize Handling
    window.addEventListener('resize', function () {
      let timer;
      throttle(
        timer,
        () => {
          // Locate and update Drawer instances on window resize
          const elements = document.body.querySelectorAll('[data-kt-drawer="true"]');
          elements.forEach((el) => {
            const item = el;
            const instance = DrawerComponent.getInstance(item.id);
            if (instance) {
              instance.element = item;
              instance.update();
            }
          });
        },
        200
      );
    });
  }

  static bootstrap() {
    DrawerComponent.createInstances('[data-kt-drawer="true"]');
    DrawerComponent.initGlobalHandlers();
    DrawerComponent.handleDismiss();
  }

  static reinitialization() {
    DrawerComponent.createInstances('[data-kt-drawer="true"]');
    DrawerComponent.hideAll();
    DrawerComponent.updateAll();
    DrawerComponent.handleDismiss();
  }
}

export { DrawerComponent, defaultDrawerOptions };
