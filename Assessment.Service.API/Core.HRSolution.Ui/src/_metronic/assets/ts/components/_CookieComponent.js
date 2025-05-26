/* eslint-disable no-useless-escape */
// DOCS = https://javascript.info/cookie
export class CookieComponent {
  /**
   * Returns the cookie with the given name, or undefined if not found
   *
   * @param  {string} name - cookie name
   * @returns {string | null}
   */
  static get(name) {
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  /**
   * Please note that a cookie value is encoded,
   * so setCookie uses a built-in encodeURIComponent function to encode it.
   *
   * @param  {string} name - cookie name
   * @param  {string | number | boolean} value - cookie value
   * @param  {object} cookieOptions - cookie options
   * @returns {void}
   */
  static set(name, value, cookieOptions = {}) {
    const options = {
      path: '/',
      // add other defaults here if necessary
      ...cookieOptions,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (const optionKey in options) {
      updatedCookie += '; ' + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

  /**
   * To delete a cookie, we can call it with a negative expiration date
   *
   * @param  {string} name
   * @returns {void}
   */
  static delete(name) {
    CookieComponent.set(name, '', {
      'max-age': -1,
    });
  }
}
