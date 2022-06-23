describe('New single strom account creation', () => {
  


  it('Visit website and accept cookies', () => {
    cy.visit('https://qa.stadtenergie.mblb.net/')
    cy.get('[data-cypress-id="acceptCookies"]:visible').click()
  })

  it('Postal box modal selection', () => {
    cy.fixture('user_details').then(data => {
      cy.get('[data-cypress-id="postalCode"]').type(data.postalCode).should('have.value', data.postalCode)
      cy.get('[name="street"]', { timeout: 10000 }).should('be.visible')
      cy.get('[name="street"]').type(data.address).should('have.value', data.address)
      cy.get('[name="houseNumber"]').type(data.houseNumber).should('have.value', data.houseNumber)
    })
    cy.get('[data-cypress-id="postalCodeToTariff"]').click()
  })

  it('Tarrif calculator screen', () => {
    cy.url().should('include', 'step=tariff')
    cy.get('[data-cypress-id="tab-electricity"]').click()
    cy.get('[id="numberPerson"]').type('{selectall}{backspace}5').should('have.value', '5')
    cy.intercept('GET', '/products/*').as('products')
    cy.get('[data-cypress-id="tariff-electricity"]').click()
  })

  it('Product search screen', () => {
    cy.url().should('include', 'step=searchProduct')
    cy.get('[data-cypress-id="continueWithOrder"]', { timeout: 30000 }).should('be.visible');
    cy.get('[data-cypress-id="continueWithOrder"]').click()
  })

  it('Input user details screen', () => {
    cy.url().should('include', 'prozess?step=0')
    const emailCalculation = "muhammad+cypresstest"+cy.moment().utc()+"@mblb.net"
    cy.fixture('user_details').then(data => {
      data.email = emailCalculation
      cy.get('[name="firstname"]').type(data.firstname).should('have.value', data.firstname)
      cy.get('[name="surname"]').type(data.firstname).should('have.value', data.lastname)
      cy.get('[name="dateOfBirth"]').type(data.dob).should('have.value', data.dob)
      cy.get('[name="email"]').type(data.email).should('have.value', data.email)
    })
  })

  



})