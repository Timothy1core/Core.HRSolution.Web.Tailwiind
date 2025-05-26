export class ElementStyleUtil {
  static set(element, property, value, important = false) {
    if (important) {
      element.style.setProperty(property, value, 'important');
    } else {
      element.style.setProperty(property, value);
    }
  }

  static get(element, attributeName) {
    return element.style.getPropertyValue(attributeName);
  }

  static remove(element, attributeName) {
    element.style.removeProperty(attributeName);
  }
}
