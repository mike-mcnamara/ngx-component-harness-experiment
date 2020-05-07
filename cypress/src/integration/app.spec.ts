import { FavoriteOceanCreatureHarness } from '../../../src/app/favorite-ocean-creature/favorite-ocean-creature.harness';
import { CypressHarnessEnvironment } from '../support/cypress-harness-environment';

describe('ngx-component-harnesses', () => {
  let harness: FavoriteOceanCreatureHarness;

  beforeEach(() => {
    cy.visit('/').then(async () => {
      cy.wait(2000)
      const loader = CypressHarnessEnvironment.loader();
      debugger;
      harness = await loader.getHarness(FavoriteOceanCreatureHarness);
    })
  });

  it('should display your favorite ocean creature in a sentence', async () => {
    const octopus = 'Octopus';
    await harness.pickOption({text: octopus});
    const text = await harness.getText();
    expect(text).eql(`My favorite ocean creature is ${octopus}`);
  });
});
