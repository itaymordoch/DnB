import pageObjects from '../fixtures/pageObjects.json';
import { task2 as testData } from '../fixtures/testData.json';


describe('Validate Amazon top nav links', () => {

 beforeEach(() => {
  cy.visitAmazon();
});


  it('2.1-2.2', () => {
    cy.get(pageObjects.nav.topLinks).then($links => {
      const actualLinks = [...$links].reduce((acc, link) => {
        acc[link.innerText.trim()] = link.getAttribute('href');
        return acc;
      }, {});

      Object.entries(testData.expectedLinks).forEach(([text, partialHref]) => {
        const actualHref = actualLinks[text];
        expect(actualHref, `Check link for "${text}"`).to.include(partialHref);
      });
    });
  });

  it('2.3-2.5', () => {
    cy.dismissToasterIfVisible();
    cy.get(pageObjects.nav.customerServiceLink).click({ scrollBehavior: false });
    cy.title().should('eq', testData.expectedTitles.customerService);
    
    cy.get(pageObjects.customerServiceSearch.input).type('where is my stuff{enter}');
    cy.get(pageObjects.customerServiceSearch.wheresMyStuffLink).click();
    cy.title().should('eq', testData.expectedTitles.wheresMyStuff);


  });
});