import dayjs from 'dayjs';
describe('Login and creation of single gas account', () => {

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('stadtenergie-token');
  })
  
  it('Visit website and accept cookies', () => {
    cy.visit('https://qa.stadtenergie.mblb.net/anmelden')
    cy.get('[data-cypress-id="acceptCookies"]:visible').click()

    cy.get("body").then(body => {
      if(body.find('[data-cypress-id="loginButton"]').length>0){
        cy.fixture('user_details').then(data => {
          cy.get('[data-cypress-id="emailResetPassword"]', { timeout: 30000 }).should('be.visible')
          cy.get('[data-cypress-id="emailResetPassword"]',{timeout:30000}).type(data.email).should('have.value', data.email)
          cy.get('[name="password"]').type(data.password).should('have.value', data.password)
          })
        cy.get('[data-cypress-id="loginButton"]').click()
        cy.get('[data-cypress-id="Übersicht"]', { timeout: 30000 }).should('be.visible')
      }
    })
  })

  it('Go to postal code step', () => {
    cy.get('div[data-cypress-id="main-page"]').click();
    cy.fixture('user_details').then(data => {
      cy.get('[data-cypress-id="postalCode"]').type(data.postalCode).should('have.value', data.postalCode)
      cy.get('[name="street"]', { timeout: 10000 }).should('be.visible')
      cy.get('[name="street"]').type(data.gasAddress).should('have.value', data.gasAddress)
      cy.get('[name="houseNumber"]').type(data.houseNumber).should('have.value', data.houseNumber)
    })
    cy.get('[data-cypress-id="postalCodeToTariff"]').click()
  })

  it('Tarrif calculator screen', () => {
    cy.url().should('include', 'step=tariff')
    cy.get('[data-cypress-id="tab-gas"]').click()
    cy.fixture('user_details').then(data => {
      cy.get('[name="livingSpace"]').type('{selectall}{backspace}200').should('have.value', data.livingSpace)
    })
    cy.intercept('GET', '/products/*').as('products')
    cy.get('[data-cypress-id="tariff-gas"]').click()
  })

  it('Product search screen', () => {
    cy.url().should('include', 'step=searchProduct')
    cy.get('[data-cypress-id="continueWithOrder"]', { timeout: 30000 }).should('be.visible');
    cy.get('[data-cypress-id="continueWithOrder"]').click()
  })

  it('Continue with user details - Step 1', () => {
    cy.url().should('include', 'prozess?step=0')
    cy.get('[data-cypress-id="nextPersonalInformation"]').click()
  })

  it('Continue with user details - Step 2', () => {
    cy.url().should('include', 'prozess?step=1')
    const now = dayjs();
    const nextMonth = now.month(now.month() + 1).date(1).hour(0).minute(0).second(0);
    const formattedNextMonth = nextMonth.format('DD.MM.YYYY')
    const runtimeCounterNumber = dayjs().unix()
    
    cy.fixture('user_details').then(data => {
      cy.get('[data-cypress-id="hasDesiredDate"]').click()
      cy.get('[name="desiredDate"]').type(formattedNextMonth).should('have.value', formattedNextMonth)
      cy.get('[name="gas_previousProviderName"]').type(data.previousProvider).should('have.value', data.previousProvider)
      cy.get('[name="gas_counterNumber"]').type(runtimeCounterNumber).should('have.value', runtimeCounterNumber)
      cy.get('[data-cypress-id="continueWithoutPayment"]').click()
    })
  })

  it('Continue with user details - Step 3', () => {
    cy.url({timeout:30000}).should('include', 'prozess?step=3')
    cy.get('div[data-cypress-id="authorizeStadtenergy"]').click();
    cy.get('div[data-cypress-id="acceptTermsAndConditionsGas"]').click();
    cy.get('div[data-cypress-id="readCancelationPolicy"]').click();
    cy.get('button[data-cypress-id="submitOrder"]').click();
  })

  it('Order submission', () => {
    cy.get('[data-cypress-id="toAccount"]', { timeout: 30000 }).should('be.visible').click()
  })

  it('Goto Contracts tab', () => {
    cy.get('[data-cypress-id="Verträge"]', { timeout: 30000 }).should('be.visible').click()
  }) 
})