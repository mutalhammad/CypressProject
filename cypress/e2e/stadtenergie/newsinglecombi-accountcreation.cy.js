import dayjs from 'dayjs';
describe('New single gas account creation', () => {
  
  const emailCalculation = 'muhammad+ct'+new Date().valueOf()+'@mblb.net'
  it('Generate and update email in fixture file', () => {
    cy.readFile("cypress/fixtures/user_details.json", (err, data) => {
      if (err) {
          return console.error(err);
      }
    }).then((data) => {
      data.email = emailCalculation
      cy.writeFile("cypress/fixtures/user_details.json", JSON.stringify(data, null, '\t'))
    })
  })


  it('Visit website and accept cookies', () => {
    cy.visit('https://qa.stadtenergie.mblb.net/')
    cy.get('[data-cypress-id="acceptCookies"]:visible',{timeout:10000}).click()
  })

  it('Postal box modal selection', () => {
    cy.fixture('user_details').then(data => {
      cy.get('[data-cypress-id="postalCode"]').type(data.postalCode).should('have.value', data.postalCode)
      cy.get('[name="street"]', { timeout: 10000 }).should('be.visible')
      cy.get('[name="street"]').type(data.combiAddress).should('have.value', data.combiAddress)
      cy.get('[name="houseNumber"]').type(data.houseNumber).should('have.value', data.houseNumber)
    })
    cy.get('[data-cypress-id="postalCodeToTariff"]').click()
  })

  it('Tarrif calculator screen', () => {
    cy.url().should('include', 'step=tariff')
    cy.fixture('user_details').then(data => {
      cy.get('[id="numberPerson"]').type('{selectall}{backspace}5').should('have.value', '5')
      cy.get('[name="livingSpace"]').type('{selectall}{backspace}200').should('have.value', data.livingSpace)
    })
    cy.intercept('GET', '/products/*').as('products')
    cy.get('[data-cypress-id="tariff-kombi"]').click()
  })

  it('Product search screen', () => {
    cy.url().should('include', 'step=searchProduct')
    cy.get('[data-cypress-id="continueWithOrder"]', { timeout: 100000 }).should('be.visible')
    cy.get('[data-cypress-id="continueWithOrder"]').click()
  })

  it('Input user details - Step 1', () => {
    cy.url().should('include', 'prozess?step=0')
    
    
    cy.fixture('user_details').then(data => {
      data.email = emailCalculation
    })
    .then(data => {
      cy.get('[name="firstname"]').type(data.firstname).should('have.value', data.firstname)
      cy.get('[name="surname"]').type(data.lastname).should('have.value', data.lastname)
      cy.get('[name="dateOfBirth"]').type(data.dob).should('have.value', data.dob)
      cy.get('[name="email"]').type(data.email).should('have.value', data.email)
      cy.get('[name="phoneNumberValue"]').type(data.phoneNumber).should('have.value', data.phoneNumber)
      cy.get('[name="street"]').should('have.value', data.combiAddress)
      cy.get('[name="houseNumber"]').should('have.value', data.houseNumber)
      cy.get('[name="postalCode"]').should('have.value', data.postalCode)
      cy.get('[data-cypress-id="nextPersonalInformation"]').click()
    })
  })

  it('Input user details - Step 2', () => {
    cy.url().should('include', 'prozess?step=1')
    const now = dayjs();
    const nextMonth = now.month(now.month() + 1).date(1).hour(0).minute(0).second(0);
    const formattedNextMonth = nextMonth.format('DD.MM.YYYY')
    const runtimeCounterNumber1 = dayjs().unix()
    const runtimeCounterNumber2 = dayjs().unix()
    
    cy.fixture('user_details').then(data => {
      cy.get('[data-cypress-id="hasDesiredDate"]').click()
      cy.get('[name="desiredDate"]').type(formattedNextMonth).should('have.value', formattedNextMonth)
      cy.get('[name="electricity_previousProviderName"]').type(data.previousProvider).should('have.value', data.previousProvider)
      cy.get('[name="electricity_counterNumber"]').type(runtimeCounterNumber1).should('have.value', runtimeCounterNumber1)
      cy.get('[name="gas_previousProviderName"]').type(data.previousProvider).should('have.value', data.previousProvider)
      cy.get('[name="gas_counterNumber"]').type(runtimeCounterNumber2).should('have.value', runtimeCounterNumber2)
      cy.get('[data-cypress-id="continueWithoutPayment"]').click()
    })
  })

  it('Input user details - Step 3', () => {
    cy.url({timeout:30000}).should('include', 'prozess?step=3')
    cy.get('div[data-cypress-id="authorizeStadtenergy"]').click();
    cy.get('div[data-cypress-id="acceptTermsAndConditionsCombi"]').click();
    cy.get('div[data-cypress-id="readCancelationPolicy"]').click();
    cy.get('button[data-cypress-id="submitOrder"]').click();
  })

  it('Order submission success & set new password', () => {
    //cy.url().should('include', 'prozess/erfolg?type=pending')
    cy.get('[data-cypress-id="toAccount"]', { timeout: 60000 }).should('be.visible').click()
    cy.fixture('user_details').then(data => {
      cy.get('[name="password"]').type(data.password).should('have.value', data.password)
      cy.get('[name="newPassword"]').type(data.password).should('have.value', data.password)
    })
    cy.get('form').submit()
  })

  it('Goto Contracts tab', () => {
    cy.get('[data-cypress-id="Verträge"]', { timeout: 30000 }).should('be.visible').click()
  })


})