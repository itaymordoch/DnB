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

Cypress.Commands.add('itemSearch', (itemName) => {
      cy.get(pageObjects.productSearch.input)
      .clear()
      .type(`${itemName}{enter}`);
});


Cypress.Commands.add('deliverySetup', (itemName) => {
    cy.get(pageObjects.nav.deliverTo).click();
    cy.wait(3000);
    // cy.get(pageObjects.deliverToModal.header).should('be.visible');
    cy.get(pageObjects.deliverToModal.countryDropdown)
        .should('be.visible')
        .click();
    cy.get('.a-dropdown-link').should('be.visible');
    cy.focused()
        .type('h');
    cy.get(pageObjects.deliverToModal.hongKongOption).parent().click();
    cy.get(pageObjects.deliverToModal.countryDropdown)
        .should('be.visible')
        .should('have.text', 'Hong Kong');
    cy.get(pageObjects.deliverToModal.doneButton).click();
    cy.get(pageObjects.nav.selectedLocation).should('contain.text', 'Hong Kong');
});
