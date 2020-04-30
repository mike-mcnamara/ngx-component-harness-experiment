import { getSelect } from '../support/app.po';

import { oceanCreatures } from '../../../src/app/favorite-ocean-creature/ocean-creatures';

const oceanSentence = 'My favorite ocean creature is';
const displayedOptions = () => cy.get('body .mat-select-panel-wrap .mat-option .mat-option-text');

describe('ngx-component-harnesses', () => {
  beforeEach(() => cy.visit('/'));

  it('displays prompt for user to "Pick your favorite" ocean creature', () => {
    getSelect().get('app-favorite-ocean-creature') .within(() => {
      cy.contains('Pick your favorite').should('be.visible');
      cy.contains(oceanSentence).should('be.visible');
    });
  });

  it('has the expected number of ocean creatuures available', () => {
    getSelect().get('app-favorite-ocean-creature-picker').click();
    displayedOptions().should('have.length', oceanCreatures.length);
  });

  oceanCreatures.forEach( (creature) => {
    it('should display ' + creature['name'] + ' ocean creature in a sentence', () => {
      getSelect().get('app-favorite-ocean-creature-picker').click();
      displayedOptions().contains(creature['name']).should('be.visible').click();
      getSelect().contains('app-favorite-ocean-creature', oceanSentence + ' ' + creature['name']).should('be.visible');
    });
  });

});
