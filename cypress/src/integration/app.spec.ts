import { FavoriteOceanCreatureHarness } from '../../../src/app/favorite-ocean-creature/favorite-ocean-creature.harness';
import { CypressHarnessEnvironment } from '../support/cypress-harness-environment';

describe('ngx-component-harnesses', () => {
  let harness: FavoriteOceanCreatureHarness;

  beforeEach(() => {
    cy.visit('/').then(async () => {
      const loader = CypressHarnessEnvironment.loader();
      harness = await loader.getHarness(FavoriteOceanCreatureHarness);
    })
  });

  it('should display your favorite ocean creature in a sentence', async () => {
    const octopus = 'Octopus';
    // debugger;
    await harness.pickOption({text: octopus});
    const text = await harness.getText();
    expect(text).eql(`My favorite ocean creature is ${octopus}`);
  });
});
