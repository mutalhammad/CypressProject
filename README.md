# Cypress Project
## _Creation of a new project - Automation of most used flows_

This project is to demonstrate the automation functionality of Cypress
on the test environment of a German energy providing company

## Features

- newsinglestrom-accountcreation
- newsinglegas-accountcreation
- newsinglecombi-accountcreation
- newsinglestrom-existinguser
- newsinglegas-existinguser
- newsinglecombi-existinguser

The Automation includes
> - Creation single strom/gas/combi order
> - New user will be created
> - First time password will be set to the generated email

Orders can be generated on the already existing user profile as well
> - Login to the existing provided email
> - Starting the order flow
> - Till the submission of the order

## Installation
Make sure that you have node_modules folder present in your project but if not then run the following command first
```sh
npm init
```
Install Cypress via 'npm'
```sh
npm install cypress --save-dev
```
This will install Cypress locally as a dev dependency

## Development
To run Cypress for your project
```sh
npx cypress open
```