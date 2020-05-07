/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  HarnessEnvironment,
  HarnessLoader,
  TestElement,
} from '@angular/cdk/testing';

import { CypressElement } from './cypress-element';

/** Options to configure the environment. */
export interface CypressHarnessEnvironmentOptions {
  /** The query function used to find DOM elements. */
  queryFn: (
    selector: string,
    root: Cypress.Chainable<JQuery<HTMLElement>>
  ) => Cypress.Chainable<JQuery<HTMLElement>>;
}

// /** The default environment options. */
const defaultEnvironmentOptions: CypressHarnessEnvironmentOptions = {
  queryFn: (selector: string, root: Cypress.Chainable<JQuery<HTMLElement>>) => root.get(selector)
};

/** A `HarnessEnvironment` implementation for Angular's Testbed. */
export class CypressHarnessEnvironment extends HarnessEnvironment<
  Cypress.Chainable<JQuery<HTMLElement>>
> {
  /** The options for this environment. */
  private _options: CypressHarnessEnvironmentOptions;

  protected constructor(
    rawRootElement: Cypress.Chainable<JQuery<HTMLElement>>, options?: CypressHarnessEnvironmentOptions) {
    super(rawRootElement);
    this._options = { ...defaultEnvironmentOptions, ...options };
  }

  /** Creates a `HarnessLoader` rooted at the given fixture's root element. */
  static loader(options?: CypressHarnessEnvironmentOptions): HarnessLoader {
    return new CypressHarnessEnvironment(cy.get('body'), options);
  }

  /**
   * Creates a `HarnessLoader` at the document root. This can be used if harnesses are
   * located outside of a fixture (e.g. overlays appended to the document body).
   */
  static documentRootLoader(): HarnessLoader {
    return new CypressHarnessEnvironment(cy.get('body'));
  }

  async forceStabilize(): Promise<void> {}

  async waitForTasksOutsideAngular(): Promise<void> {}

  protected getDocumentRoot(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('body');
  }

  protected createTestElement(
    element: Cypress.Chainable<JQuery<HTMLElement>>
  ): TestElement {
    return new CypressElement(element, () => this.forceStabilize());
  }

  protected createEnvironment(
    element: Cypress.Chainable<JQuery<HTMLElement>>
  ): HarnessEnvironment<Cypress.Chainable<JQuery<HTMLElement>>> {
    return new CypressHarnessEnvironment(element, this._options);
  }

  protected async getAllRawElements(
    selector: string
  ): Promise<Cypress.Chainable<JQuery<HTMLElement>>[]> {
    const elementArrayFinder = this._options.queryFn(
      selector,
      this.rawRootElement
    );
    const elements: Cypress.Chainable<JQuery<HTMLElement>>[] = [];
    await elementArrayFinder.each(($el) => elements.push(cy.wrap($el))).promisify();
    return elements;
  }
}
