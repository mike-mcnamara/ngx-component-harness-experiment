import * as keyCodes from '@angular/cdk/keycodes';
import {
  ElementDimensions,
  ModifierKeys,
  TestElement,
  TestKey,
} from '@angular/cdk/testing';

/** Maps `TestKey` constants to the cypress values */
const keyMap = {
  [TestKey.BACKSPACE]: '{backspace}',
  [TestKey.TAB]: '{tab}', // doesn't work in cypress yet...
  [TestKey.ENTER]: '{enter}',
  [TestKey.SHIFT]: '{shift}',
  [TestKey.CONTROL]: '{ctrl}',
  [TestKey.ALT]: '{alt}',
  [TestKey.ESCAPE]: '{esc}',
  [TestKey.PAGE_UP]: '{pageup}',
  [TestKey.PAGE_DOWN]: '{pagedown}',
  [TestKey.END]: '{end}',
  [TestKey.HOME]: '{home}',
  [TestKey.LEFT_ARROW]: '{leftarrow}',
  [TestKey.UP_ARROW]: '{uparrow}',
  [TestKey.RIGHT_ARROW]: '{rightarrow}',
  [TestKey.DOWN_ARROW]: '{downarrow}',
  [TestKey.INSERT]: '{insert}',
  [TestKey.DELETE]: '{del}',
  [TestKey.F1]: '{f1}',
  [TestKey.F2]: '{f2}',
  [TestKey.F3]: '{f3}',
  [TestKey.F4]: '{f4}',
  [TestKey.F5]: '{f5}',
  [TestKey.F6]: '{f6}',
  [TestKey.F7]: '{f7}',
  [TestKey.F8]: '{f8}',
  [TestKey.F9]: '{f9}',
  [TestKey.F10]: '{f10}',
  [TestKey.F11]: '{f11}',
  [TestKey.F12]: '{f12}',
  [TestKey.META]: '{meta}',
};

/** Converts a `ModifierKeys` object to a list of Cypress `Key`s. */
function toCypressModifierKeys(modifiers: ModifierKeys): string[] {
  const result: string[] = [];
  if (modifiers.control) {
    result.push(keyMap[TestKey.CONTROL]);
  }
  if (modifiers.alt) {
    result.push(keyMap[TestKey.ALT]);
  }
  if (modifiers.shift) {
    result.push(keyMap[TestKey.SHIFT]);
  }
  if (modifiers.meta) {
    result.push(keyMap[TestKey.META]);
  }
  return result;
}

/** A `TestElement` implementation for Cypress. */
export class CypressElement implements TestElement {
  constructor(readonly element: Cypress.Chainable<JQuery<HTMLElement>>, private _stabilize: () => Promise<void>) {}

  async blur(): Promise<void> {
    // browser.executeScript('arguments[0].blur()', this.element);
    this.element.focus().blur();
    return this._stabilize();
  }

  async clear(): Promise<void> {
    this.element.clear();
    return this._stabilize();
  }

  // This will need overrides implemented to support more than just number array args https://on.cypress.io/click
  async click(...args: number[]): Promise<void> {
    // Omitting the offset argument to mouseMove results in clicking the center.
    // This is the default behavior we want, so we use an empty array of offsetArgs if no args are
    // passed to this method.
    // const offsetArgs = args.length ? [{ x: args[0], y: args[1] }] : [];

    // await browser
    //   .actions()
    //   .mouseMove(await this.element.getWebElement(), ...offsetArgs)
    //   .click()
    //   .perform();

    this.element.click(); // TODO ignore the x,y for now...
    return this._stabilize();
  }

  async focus(): Promise<void> {
    // return browser.executeScript('arguments[0].focus()', this.element);
    this.element.focus();
    return this._stabilize();
  }

  async getCssValue(property: string): Promise<string> {
    // return this.element.getCssValue(property);

    return await this.getAttribute(property) || '';
  }

  async hover(): Promise<void> {
    //  return browser
    //    .actions()
    //    .mouseMove(await this.element.getWebElement())
    //    .perform();

    this.element.trigger('mouseover');
    return this._stabilize();
  }

  async sendKeys(...keys: (string | TestKey)[]): Promise<void>;
  async sendKeys(
    modifiers: ModifierKeys,
    ...keys: (string | TestKey)[]
  ): Promise<void>;
  async sendKeys(...modifiersAndKeys: any[]): Promise<void> {
     const first = modifiersAndKeys[0];
     let modifiers: ModifierKeys;
     let rest: (string | TestKey)[];
     if (typeof first !== 'string' && typeof first !== 'number') {
       modifiers = first;
       rest = modifiersAndKeys.slice(1);
     } else {
       modifiers = {};
       rest = modifiersAndKeys;
     }
     const modifierKeys = toCypressModifierKeys(modifiers);
     const keys = [...modifierKeys, ...rest
       .map((k) =>
         typeof k === 'string' ? k : keyMap[k]
       )];

    // might need to try this if we need fancy keys that cypress doesn't support yet (like tab...)
    // this.element.trigger('keydown', { keyCode: 192 })
    // cy.wait(50);
    // this.element.trigger('keyup', { keyCode: 192 })

    this.element.type(keys.toString());
    return this._stabilize();
  }

  async text(): Promise<string> {
    // return this.element.getText();
    return this.element.invoke('text').promisify();
  }

  async getAttribute(name: string): Promise<string | null> {
    //  return browser.executeScript(
    //    `return arguments[0].getAttribute(arguments[1])`,
    //    this.element,
    //    name
    //  );

    // this might work the same way get css value does
    return this.element
      .invoke('attr', name)
      .promisify()
      .then((val: string) => val);
  }

  async hasClass(name: string): Promise<boolean> {
    const classes = (await this.getAttribute('class')) || '';
    return new Set(classes.split(/\s+/).filter((c) => c)).has(name);
  }

  async getDimensions(): Promise<ElementDimensions> {
    let width;
    const height;
    // this.element.its('height');
    const { x: left, y: top } = await this.element.getLocation();

    this.element
      .its('width')
      .then((val: number) => {
        width = val;
      });

    return { width, height, left, top };
  }

  async getProperty(name: string): Promise<any> {
    return browser.executeScript(
      `return arguments[0][arguments[1]]`,
      this.element,
      name
    );
  }

  async matchesSelector(selector: string): Promise<boolean> {
    return browser.executeScript(
      `
          return (Element.prototype.matches ||
                  Element.prototype.msMatchesSelector).call(arguments[0], arguments[1])
          `,
      this.element,
      selector
    );
  }

  async isFocused(): Promise<boolean> {
    return this.element.equals(browser.driver.switchTo().activeElement());
  }
}
