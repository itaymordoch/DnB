import pageObjects from '../fixtures/pageObjects.json';
import testData from '../fixtures/testData.json';

Cypress.Commands.add('visitAmazon', () => {
  cy.visit(testData.homepageURL, { failOnStatusCode: false });

  //reload if no navBar is found
  cy.get('body').then($body => {
    if ($body.find(pageObjects.nav.navBar).length === 0) {
      cy.get(pageObjects.nav.logo).click();
    }
  });
});

Cypress.Commands.add('dismissToasterIfVisible', () => {
  cy.get(pageObjects.toaster.container, { timeout: 5000 }).then($toaster => {
      if ($toaster.length) {
        cy.wrap($toaster)
          .find(pageObjects.toaster.dismissButton)
          .click();
        cy.wrap($toaster).should('not.exist');

      } 
    });
    cy.scrollTo('top');
});