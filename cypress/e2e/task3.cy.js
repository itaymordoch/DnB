import { task3 as testData } from '../fixtures/testData.json';
import pageObjects from '../fixtures/pageObjects.json';

describe('Amazon Shopping Cart Suite', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
    cy.visitAmazon();

    cy.deliverySetup();

    testData.searchItems.forEach((item) => {
     cy.itemSearch(item);
    });
    
    cy.get(pageObjects.productSearch.searchResults).first().click();
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('cardModuleFactory')) {
            return false;
        }
    });

    cy.get(pageObjects.cart.addToCart).click();

    cy.get(pageObjects.cart.addedToCartMessage, { timeout: 5000 })
    .should('be.visible');
    cy.get(pageObjects.cart.addedToCartDismiss).click();

    cy.visit(testData.scissorsURL);

    cy.get(pageObjects.scissors.desiredColor).filter(':visible').click();
    cy.get(pageObjects.scissors.selectedColorText).should('contain.text', testData.scissorsDesiredColor);
    cy.get(pageObjects.scissors.desiredColorImage)
    .filter(':visible')
    .should('be.visible')
    .should('have.attr', 'src', testData.scissorsColorImageURL);
    cy.scrollTo('top');

    cy.get(pageObjects.cart.addToCart).click();
    cy.contains('Added to cart')
    .should('be.visible');

    cy.get(pageObjects.cart.cartCounter).should('have.text', '2');
  });

  it('Not Qualified', () => {
    cy.get(pageObjects.cart.openCart).click();
    cy.get(pageObjects.cart.shippingStatus)
    .should('contain', testData.notQualifiedMsg);
});

  it('Qualified', () => {
    cy.get(pageObjects.cart.openCart).click();
    cy.get(pageObjects.cart.incrementQuantity).last().click();
    cy.get(pageObjects.cart.incrementQuantity).last().click();
    cy.get(pageObjects.cart.shippingStatus)
    .should('contain', testData.qualifiedMsg);
});

  afterEach(() => {
    cy.get(pageObjects.cart.openCart).click();
    cy.get(pageObjects.cart.removeItem).first().click();
    cy.get(pageObjects.cart.removeItem).last().click();
    cy.get(pageObjects.cart.cartCounter).should('have.text', '0');
  });

});
