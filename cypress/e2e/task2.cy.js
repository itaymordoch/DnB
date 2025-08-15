describe('Validate Amazon top nav links', () => {

  // beforeEach(() => {
  //   cy.visit('https://www.amazon.com');
  // });
 beforeEach(() => {
  cy.visit('https://www.amazon.com', { failOnStatusCode: false });

  cy.get('body').then($body => {
    if ($body.find('#nav-xshop').length === 0) {
      cy.get('#nav-bb-logo').click();
    }
  });
});



  it('2.1-2.2', () => {
    const expectedLinks = {
      "Today's Deals": "/gp/goldbox",
      "Prime Video": "/Amazon-Video",
      "Registry": "/gp/browse.html",
      "Customer Service": "/gp/help/customer/display.html",
      "Gift Cards": "/gift-cards",
      "Sell": "/b"
    };

    cy.get('ul.nav-ul a').then($links => {
      const actualLinks = [...$links].reduce((acc, link) => {
        acc[link.innerText.trim()] = link.getAttribute('href');
        return acc;
      }, {});

      console.log(actualLinks);
      cy.log(JSON.stringify(actualLinks));

      Object.entries(expectedLinks).forEach(([text, partialHref]) => {
        const actualHref = actualLinks[text];
        expect(actualHref, `Check link for "${text}"`).to.include(partialHref);
      });
    });
  }),

  it('2.3-2.5', () => {
    cy.get('div[role="alertdialog"]', { timeout: 5000 }).then($toaster => {
      if ($toaster.length) {
        cy.wrap($toaster)
          .find('input[data-action-type="DISMISS"]')
          .click();
        cy.wrap($toaster).should('not.exist');

      } 
    });

    cy.scrollTo('top');
    cy.contains('.nav-li a', 'Customer Service').click({ scrollBehavior: false });
    cy.title().should('eq', 'Help & Contact Us - Amazon Customer Service');
    
    cy.get('#hubHelpSearchInput').type('where is my stuff{enter}');
    cy.contains('a', 'Where\'s My Stuff?').click()
    cy.title().should('eq', 'Where\'s My Stuff? - Amazon Customer Service');


  });
});
