import {
  DataUtil,
  ElementStyleUtil,
  EventHandlerUtil,
  getUniqueIdWithPrefix,
  getAttributeValueByBreakpoint,
} from '../_utils/index';

const defaultFeedbackOptions = {
  width: 100,
  placement: 'top-center',
  content: '',
  type: 'popup',
};

class FeedbackComponent {
  constructor(_element, options) {
    this.element = _element;
    this.options = Object.assign(defaultFeedbackOptions, options);
    this.instanceUid = getUniqueIdWithPrefix('feedback');
    this.shown = false;

    // Event handlers
    this._handlers();
    DataUtil.set(this.element, 'feedback', this);
  }

  _handlers() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this._go();
    });
  }

  _go() {
    // Logic for _go() needs to be implemented
  }

  showPopup() {
    const popupElement = document.createElement('DIV');
    popupElement.classList.add('feedback', 'feedback-popup');
    popupElement.innerHTML = this.options.content || '';

    if (this.options.placement === 'top-center') {
      this.setPopupTopCenterPosition(popupElement);
    }

    document.body.appendChild(popupElement);
    popupElement.classList.add('feedback-shown');
    this.shown = true;
    this.element = popupElement;
  }

  setPopupTopCenterPosition(popupElement) {
    const width = getAttributeValueByBreakpoint(this.options.width?.toString() || '0');
    const height = ElementStyleUtil.get(popupElement, 'height');
    popupElement.classList.add('feedback-top-center');
    ElementStyleUtil.set(popupElement, 'width', width);
    ElementStyleUtil.set(popupElement, 'left', '50%');
    ElementStyleUtil.set(popupElement, 'top', '-' + height);
  }

  hidePopup() {
    if (this.element) {
      this.element.remove();
    }
  }

  // Public API
  show() {
    if (EventHandlerUtil.trigger(this.element, 'kt.feedback.show') === false) {
      return;
    }

    if (this.options.type === 'popup') {
      this.showPopup();
    }

    EventHandlerUtil.trigger(this.element, 'kt.feedback.shown');
    return this;
  }

  hide() {
    if (EventHandlerUtil.trigger(this.element, 'kt.feedback.hide') === false) {
      return;
    }

    if (this.options.type === 'popup') {
      this.hidePopup();
    }

    this.shown = false;
    EventHandlerUtil.trigger(this.element, 'kt.feedback.hidden');
    return this;
  }

  isShown() {
    return this.shown;
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
  static createInstances(selector) {
    throw new Error('not implemented');
  }

  static hasInstance(element) {
    throw new Error('not implemented');
  }

  static getInstance(element) {
    throw new Error('not implemented');
  }

  static bootstrap(attr = '[data-feedback]') {
    throw new Error('not implemented');
  }
}

export { FeedbackComponent, defaultFeedbackOptions };
