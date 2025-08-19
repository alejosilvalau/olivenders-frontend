describe('Main wand purchase flow', () => {
  it('Should log in, filter, buy a wand, place an order, and log out', () => {
    // 1. Go to the main page
    cy.visit('/');

    // 2. Log in
    cy.contains(/log in/i).click();
    cy.get('#username').type('dracomalfoy');
    cy.get('#password').type('Expelio123#@@');
    cy.get('button[type="submit"]').contains(/log in/i).click();

    // 3. Filter by price higher than 1200
    // Only click "Show Filters" if the button exists (mobile)
    cy.get('body').then($body => {
      if ($body.find('button:contains(/show filters/i)').length) {
        cy.contains(/show filters/i).click({ force: true });
      }
    });
    cy.get('#minPrice').clear().type('1200');
    cy.get('button[type="submit"].btn-filter').click();
    // Wait for at least one product card to appear after filtering

    // 4. Waits for the wand-card to appear and clicks on the buy button of the first wand that appears
    cy.get('.wand-card').first().scrollIntoView();
    cy.get('a.btn.custom-buy-button').first().click();

    // 5. Type in an address and select a payment method
    cy.get('#shipping_address').type('Magic Street 123');
    cy.get('#payment_provider').select(1); // Selects the second payment method

    // 6. Place the order
    cy.get('button.order-button').contains(/place order/i).click();

    // 7. Confirm order in the modal
    cy.wait(2000);
    cy.get('button').contains(/^confirm new order$/i).click();
    cy.wait(2000);

    // 8. Click OK on the order confirmation modal
    cy.get('button').contains('OK').should('be.visible').click();
    cy.wait(2000);

    // 9. Wait for the payment to be simulated and click OK on the simulated payment modal
    cy.get('button').contains('OK').should('be.visible').click();

    // 10. Log out
    cy.wait(2000);
    cy.get('button#dropdownDefaultButton').click();
    cy.get('a').contains(/log out/i).click();
  });
});
